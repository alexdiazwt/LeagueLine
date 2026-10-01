// mongo/equipment-seed.js
// The fields and data types match the equipmentItems list in equipment.js.
// How to run (in mongosh, from the project folder):
//     load("mongo/equipment-seed.js")
// Running it again deletes the old sample documents first, so you won't get duplicates.

db = db.getSiblingDB("leagueline");

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
        sizes: null
    },
    {
        itemId: "glove",
        name: "Gloves",
        sport: "softball",
        pricePerSeason: 25,
        quantityAvailable: 20,
        isAvailable: true,
        details: "12 inch fielding gloves.",
        sizes: ["Left hand", "Right hand"]
    },
    {
        itemId: "jersey",
        name: "Jerseys",
        sport: "softball",
        pricePerSeason: 20,
        quantityAvailable: 40,
        isAvailable: true,
        details: "Numbered team jerseys. Price also covers replacing any that are lost or damaged.",
        sizes: ["S", "M", "L", "XL", "2XL"]
    },
    {
        itemId: "catcher-gear",
        name: "Catcher's Gear Set",
        sport: "softball",
        pricePerSeason: 35,
        quantityAvailable: 0,
        isAvailable: false,
        details: "Helmet, chest protector, and shin guards.",
        sizes: null
    }
]);

print("Inserted " + db.equipment.countDocuments() + " equipment documents.");
