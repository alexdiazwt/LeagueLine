// seed-all.js - fills all 6 LeagueLine collections with sample data
// paste into the MongoDB shell in Compass (it deletes the old documents first)

db = db.getSiblingDB("leagueline");

// ---------- leagues ----------
db.leagues.deleteMany({});
db.leagues.insertMany([
    {
        leagueId: "softball-fall-2026",
        sport: "softball",
        name: "Fall 2026 Coed Softball League",
        season: "Fall 2026",
        location: "West Texas Rec Park",
        gameDays: [
            "Saturday",
            "Sunday"
        ],
        seasonWeeks: 10,
        feePerTeam: 250,
        maxTeams: 12,
        registeredTeams: 8,
        minPlayers: 10,
        maxPlayers: 20,
        status: "open",
        description: "A 10-week coed slow-pitch league for teams that already have players and just need somewhere to play.",
        imageUrl: "images/sport-softball.png"
    },
    {
        leagueId: "soccer-spring-2027",
        sport: "soccer",
        name: "Spring 2027 Coed Soccer League",
        season: "Spring 2027",
        location: "West Texas Rec Park",
        gameDays: [
            "Saturday"
        ],
        seasonWeeks: 8,
        feePerTeam: 300,
        maxTeams: 10,
        registeredTeams: 0,
        minPlayers: 9,
        maxPlayers: 16,
        status: "coming-soon",
        description: "An 8-week coed 7v7 soccer league. Applications open in January.",
        imageUrl: "images/sport-soccer.png"
    },
    {
        leagueId: "basketball-winter-2027",
        sport: "basketball",
        name: "Winter 2027 Coed Basketball League",
        season: "Winter 2027",
        location: "West Texas Rec Park Gym",
        gameDays: [
            "Tuesday",
            "Thursday"
        ],
        seasonWeeks: 8,
        feePerTeam: 200,
        maxTeams: 8,
        registeredTeams: 0,
        minPlayers: 5,
        maxPlayers: 10,
        status: "coming-soon",
        description: "An 8-week indoor 5v5 league on weeknights.",
        imageUrl: "images/sport-basketball.png"
    }
]);

// ---------- equipment ----------
db.equipment.deleteMany({});
db.equipment.insertMany([
    {
        itemId: "bat",
        name: "Bats",
        sport: "softball",
        pricePerSeason: 20,
        quantityAvailable: 15,
        isAvailable: true,
        details: "Aluminum slow-pitch bats, 34 inch. Grip tape included.",
        sizes: null,
        imageUrl: "images/equip-bat.png"
    },
    {
        itemId: "glove",
        name: "Gloves",
        sport: "softball",
        pricePerSeason: 25,
        quantityAvailable: 20,
        isAvailable: true,
        details: "12 inch fielding gloves.",
        sizes: [
            "Left hand",
            "Right hand"
        ],
        imageUrl: "images/equip-glove.png"
    },
    {
        itemId: "jersey",
        name: "Jerseys",
        sport: "softball",
        pricePerSeason: 20,
        quantityAvailable: 40,
        isAvailable: true,
        details: "Numbered team jerseys. Price also covers replacing any that are lost or damaged.",
        sizes: [
            "S",
            "M",
            "L",
            "XL",
            "2XL"
        ],
        imageUrl: "images/equip-jersey.png"
    },
    {
        itemId: "catcher-gear",
        name: "Catcher's Gear Set",
        sport: "softball",
        pricePerSeason: 35,
        quantityAvailable: 0,
        isAvailable: false,
        details: "Helmet, chest protector, and shin guards.",
        sizes: null,
        imageUrl: "images/equip-catcher-gear.png"
    }
]);

// ---------- applications ----------
db.applications.deleteMany({});
db.applications.insertMany([
    {
        applicationId: "APP-1001",
        teamName: "Buffalo Herd",
        managerName: "Marcus T.",
        managerEmail: "marcus@email.com",
        leagueId: "softball-fall-2026",
        leagueName: "Fall 2026 Coed Softball League",
        teamSize: 14,
        status: "approved",
        submittedAt: new Date("2026-09-02"),
        leagueFee: 250,
        feePaid: false
    },
    {
        applicationId: "APP-1002",
        teamName: "Dust Devils",
        managerName: "Priya S.",
        managerEmail: "priya@email.com",
        leagueId: "softball-fall-2026",
        leagueName: "Fall 2026 Coed Softball League",
        teamSize: 12,
        status: "approved",
        submittedAt: new Date("2026-08-28"),
        leagueFee: 250,
        feePaid: true
    },
    {
        applicationId: "APP-1003",
        teamName: "Canyon Crushers",
        managerName: "Jordan R.",
        managerEmail: "jordan@email.com",
        leagueId: "softball-fall-2026",
        leagueName: "Fall 2026 Coed Softball League",
        teamSize: 11,
        status: "pending",
        submittedAt: new Date("2026-10-12"),
        leagueFee: 250,
        feePaid: false
    }
]);

// ---------- rentals ----------
db.rentals.deleteMany({});
db.rentals.insertMany([
    {
        rentalId: "RENT-2001",
        applicationId: "APP-1001",
        status: "approved",
        requestedAt: new Date("2026-09-05"),
        items: [
            {
                itemId: "bat",
                name: "Bats",
                size: null,
                quantity: 2,
                pricePerSeason: 20
            },
            {
                itemId: "glove",
                name: "Gloves",
                size: "Left hand",
                quantity: 1,
                pricePerSeason: 25
            },
            {
                itemId: "glove",
                name: "Gloves",
                size: "Right hand",
                quantity: 3,
                pricePerSeason: 25
            },
            {
                itemId: "jersey",
                name: "Jerseys",
                size: "S",
                quantity: 2,
                pricePerSeason: 20
            },
            {
                itemId: "jersey",
                name: "Jerseys",
                size: "M",
                quantity: 5,
                pricePerSeason: 20
            },
            {
                itemId: "jersey",
                name: "Jerseys",
                size: "L",
                quantity: 4,
                pricePerSeason: 20
            },
            {
                itemId: "jersey",
                name: "Jerseys",
                size: "XL",
                quantity: 3,
                pricePerSeason: 20
            }
        ],
        gearPaid: false
    },
    {
        rentalId: "RENT-2002",
        applicationId: "APP-1002",
        status: "fulfilled",
        requestedAt: new Date("2026-08-30"),
        items: [
            {
                itemId: "jersey",
                name: "Jerseys",
                size: "M",
                quantity: 4,
                pricePerSeason: 20
            },
            {
                itemId: "jersey",
                name: "Jerseys",
                size: "L",
                quantity: 5,
                pricePerSeason: 20
            },
            {
                itemId: "jersey",
                name: "Jerseys",
                size: "XL",
                quantity: 3,
                pricePerSeason: 20
            }
        ],
        gearPaid: true
    }
]);

// ---------- reviews ----------
db.reviews.deleteMany({});
db.reviews.insertMany([
    {
        reviewerName: "Marcus T.",
        rating: 5,
        leagueId: "softball-fall-2026",
        comment: "Ran our softball team's sign-up entirely by group text last year and almost missed the deadline. Filled out LeagueLine's application in five minutes and rented the catcher's gear same day - way less coordinating on my end.",
        createdAt: new Date("2026-09-20")
    },
    {
        reviewerName: "Priya S.",
        rating: 4,
        leagueId: "softball-fall-2026",
        comment: "Half our roster is new to organized leagues and didn't own any gear. Being able to rent jerseys through the same site we applied on saved everyone a separate errand. Wish there were more weeknight game slots, otherwise great.",
        createdAt: new Date("2026-10-02")
    }
]);

// ---------- messages ----------
db.messages.deleteMany({});
db.messages.insertMany([
    {
        senderName: "Jordan R.",
        senderEmail: "jordan@email.com",
        topic: "equipment",
        message: "Do you have left-handed gloves in stock for our first game?",
        sentAt: new Date("2026-10-13"),
        status: "new"
    },
    {
        senderName: "Priya S.",
        senderEmail: "priya@email.com",
        topic: "payment",
        message: "Can we pay the league fee and the jersey rental together at the front desk?",
        sentAt: new Date("2026-09-01"),
        status: "answered"
    }
]);

print("leagues: " + db.leagues.countDocuments() +
      ", equipment: " + db.equipment.countDocuments() +
      ", applications: " + db.applications.countDocuments() +
      ", rentals: " + db.rentals.countDocuments() +
      ", reviews: " + db.reviews.countDocuments() +
      ", messages: " + db.messages.countDocuments());
