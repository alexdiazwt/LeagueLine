// server.js – LeagueLine web server
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://localhost:27017";

app.use(express.json());
app.use(express.static(__dirname));

let db;

// same email check as the website: an @ with a dot somewhere after it
function looksLikeEmail(email) {
  const atPosition = email.indexOf("@");
  const dotPosition = email.lastIndexOf(".");
  return atPosition >= 1 && dotPosition >= atPosition + 2;
}

// ROUTE: send every league to the browser
app.get("/api/leagues", async (req, res) => {
  const leagues = await db.collection("leagues").find().toArray();
  res.json(leagues);
});

// ROUTE: send every equipment item to the browser
app.get("/api/equipment", async (req, res) => {
  const equipment = await db.collection("equipment").find().toArray();
  res.json(equipment);
});

// ROUTE: send every review to the browser
app.get("/api/reviews", async (req, res) => {
  const reviews = await db.collection("reviews").find().toArray();
  res.json(reviews);
});

// ROUTE: save a new team application
app.post("/api/applications", async (req, res) => {
  const teamName = req.body.teamName;
  const managerName = req.body.managerName;
  const managerEmail = req.body.managerEmail;
  const teamSize = Number(req.body.teamSize);

  // 1. check the data again on the server
  if (!teamName || !managerName || !managerEmail || !teamSize) {
    return res.status(400).json({ error: "Please fill in your team name, manager name, email, and team size." });
  }
  if (!looksLikeEmail(managerEmail)) {
    return res.status(400).json({ error: "Please enter a valid email, like manager@email.com." });
  }

  // 2. get the league so the rules come from the database, not hard-coded
  const league = await db.collection("leagues").findOne({ leagueId: "softball-fall-2026" });
  if (teamSize < league.minPlayers || teamSize > league.maxPlayers) {
    return res.status(400).json({ error: "Team size must be from " + league.minPlayers + " to " + league.maxPlayers + " players." });
  }
  if (league.registeredTeams >= league.maxTeams) {
    return res.status(400).json({ error: "Sorry, this league is full. Check back next season!" });
  }

  // 3. no two teams with the same name (strength 2 = ignore capital letters)
  const existing = await db.collection("applications").findOne(
    { teamName: teamName },
    { collation: { locale: "en", strength: 2 } }
  );
  if (existing) {
    return res.status(409).json({ error: "A team named \"" + teamName + "\" has already applied. Check its status on the My Team page, or pick a different name." });
  }

  // 4. build the document with the same fields as the applications collection
  const count = await db.collection("applications").countDocuments();
  const application = {
    applicationId: "APP-" + (count + 1001),
    teamName: teamName,
    managerName: managerName,
    managerEmail: managerEmail,
    leagueId: league.leagueId,
    leagueName: league.name,
    teamSize: teamSize,
    status: "pending",
    submittedAt: new Date(),
    leagueFee: league.feePerTeam,
    feePaid: false
  };

  // 5. save it, then send it back so the page can confirm
  await db.collection("applications").insertOne(application);
  res.status(201).json(application);
});

// ROUTE: save a new review
app.post("/api/reviews", async (req, res) => {
  const reviewerName = req.body.reviewerName;
  const rating = Number(req.body.rating);
  const comment = req.body.comment;

  // 1. check the data again on the server
  if (!reviewerName || !comment) {
    return res.status(400).json({ error: "Please enter your name and a comment." });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be from 1 to 5 stars." });
  }
  if (comment.length < 20 || comment.length > 300) {
    return res.status(400).json({ error: "Reviews must be 20 to 300 characters." });
  }

  // 2. build the document (same fields as the reviews collection)
  const review = {
    reviewerName: reviewerName,
    rating: rating,
    leagueId: "softball-fall-2026",
    comment: comment,
    createdAt: new Date()
  };

  // 3. save it, then send it back
  await db.collection("reviews").insertOne(review);
  res.status(201).json(review);
});

// ROUTE: save a contact message from the FAQ page
app.post("/api/messages", async (req, res) => {
  const senderName = req.body.senderName;
  const senderEmail = req.body.senderEmail;
  const topic = req.body.topic;
  const message = req.body.message;

  // 1. check
  const topics = ["league", "equipment", "payment", "other"];
  if (!senderName || !senderEmail || !message) {
    return res.status(400).json({ error: "Please fill in your name, email, and message." });
  }
  if (!looksLikeEmail(senderEmail)) {
    return res.status(400).json({ error: "Please enter a valid email, like manager@email.com." });
  }
  if (!topics.includes(topic)) {
    return res.status(400).json({ error: "Please pick a topic from the list." });
  }
  if (message.length < 10 || message.length > 500) {
    return res.status(400).json({ error: "Messages must be 10 to 500 characters." });
  }

  // 2. build (same fields as the messages collection)
  const newMessage = {
    senderName: senderName,
    senderEmail: senderEmail,
    topic: topic,
    message: message,
    sentAt: new Date(),
    status: "new"
  };

  // 3. save + respond
  await db.collection("messages").insertOne(newMessage);
  res.status(201).json(newMessage);
});

// ROUTE: save a gear request (rental)
app.post("/api/rentals", async (req, res) => {
  const teamName = req.body.teamName;
  const requested = req.body.items;

  // 1a. basic checks
  if (!teamName) {
    return res.status(400).json({ error: "Please enter your team name." });
  }
  if (!Array.isArray(requested) || requested.length === 0) {
    return res.status(400).json({ error: "Add at least one item before requesting gear." });
  }

  // 1b. the team has to apply first (strength 2 = ignore capital letters)
  const application = await db.collection("applications").findOne(
    { teamName: teamName },
    { collation: { locale: "en", strength: 2 } }
  );
  if (!application) {
    return res.status(404).json({ error: "We couldn't find a league application for \"" + teamName + "\". Apply on the Softball page first, using the same team name." });
  }

  // 1c. one gear request per team
  const existingRental = await db.collection("rentals").findOne({ applicationId: application.applicationId });
  if (existingRental) {
    return res.status(409).json({ error: application.teamName + " already has a gear request. You can check its status on the My Team page." });
  }

  // 1d. check every line against the equipment collection
  //     prices and stock come from the DATABASE, not from the page
  const equipment = await db.collection("equipment").find().toArray();
  const items = [];
  const totalPerItem = {};   // e.g. { jersey: 12 } across all sizes

  for (let i = 0; i < requested.length; i++) {
    const line = requested[i];
    const item = equipment.find((e) => e.itemId === line.itemId);
    const quantity = Number(line.quantity);

    if (!item || item.isAvailable === false) {
      return res.status(400).json({ error: "One of the items you picked isn't available right now." });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: "Quantities must be whole numbers of 1 or more." });
    }

    let size = null;
    if (item.sizes !== null) {
      if (!item.sizes.includes(line.size)) {
        return res.status(400).json({ error: "Please pick a valid size for " + item.name + "." });
      }
      size = line.size;
    }

    totalPerItem[item.itemId] = (totalPerItem[item.itemId] || 0) + quantity;
    if (totalPerItem[item.itemId] > item.quantityAvailable) {
      return res.status(400).json({ error: item.name + ": only " + item.quantityAvailable + " available this season." });
    }

    items.push({ itemId: item.itemId, name: item.name, size: size, quantity: quantity, pricePerSeason: item.pricePerSeason });
  }

  // 2. build (same fields as the rentals collection)
  const count = await db.collection("rentals").countDocuments();
  const rental = {
    rentalId: "RENT-" + (count + 2001),
    applicationId: application.applicationId,
    status: "pending",
    requestedAt: new Date(),
    items: items,
    gearPaid: false
  };

  // 3. save + respond (with the total worked out on the server)
  await db.collection("rentals").insertOne(rental);
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].quantity * items[i].pricePerSeason;
  }
  res.status(201).json({ rental: rental, teamName: application.teamName, total: total });
});

// ROUTE: look up one team's application + gear request (My Team page)
// example: /api/myteam?teamName=Buffalo Herd&email=marcus@email.com
app.get("/api/myteam", async (req, res) => {
  const teamName = req.query.teamName;
  const email = req.query.email;

  if (!teamName || !email) {
    return res.status(400).json({ error: "Please enter your team name and manager email." });
  }

  // both have to match (capital letters ignored)
  const application = await db.collection("applications").findOne(
    { teamName: teamName, managerEmail: email },
    { collation: { locale: "en", strength: 2 } }
  );
  if (!application) {
    return res.status(404).json({ error: "We couldn't find an application for that team name and email. Check the spelling, or apply on the Softball page." });
  }

  // the gear request linked by applicationId (null if they don't have one)
  const rental = await db.collection("rentals").findOne({ applicationId: application.applicationId });

  res.json({ application: application, rental: rental });
});

// connect to MongoDB first, THEN start the server
MongoClient.connect(MONGO_URL).then((client) => {
  db = client.db("leagueline");
  app.listen(PORT, () => {
    console.log("LeagueLine running at http://localhost:" + PORT);
  });
}).catch(() => {
  console.log("Could not connect to MongoDB at " + MONGO_URL + ". Make sure MongoDB is running, then run npm start again.");
});