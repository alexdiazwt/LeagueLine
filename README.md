# LeagueLine

LeagueLine is a full-stack web app for local softball, soccer, and basketball teams in West Texas.
Team managers can browse leagues, apply as a team, rent equipment for the season, check their
team's status, leave reviews, and contact the league office.

Built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## Requirements

- [Node.js](https://nodejs.org) 18 or newer (built and tested with v24)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on `localhost:27017`
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (used to load the sample data)
- A web browser

## Setup

1. **Get the code**
   ```
   git clone https://github.com/alexdiazwt/LeagueLine.git
   cd LeagueLine
   ```
2. **Install the packages** (Express and the MongoDB driver)
   ```
   npm install
   ```
   On Windows, if PowerShell says "running scripts is disabled," switch the terminal to Command Prompt and run it again.
3. **Load the sample data**
   - Open Compass and connect to `mongodb://localhost:27017`.
   - Open the MongoDB shell in Compass (`>_` button).
   - Paste the whole contents of `mongo/seed-all.js` and press Enter.
   - This creates the `leagueline` database with 6 collections: leagues, equipment, applications, rentals, reviews, and messages.
   - More detail and field descriptions: [mongo/README.md](mongo/README.md)
4. **Start the server**
   ```
   npm start
   ```
   You should see: `LeagueLine running at http://localhost:3000`
5. **Open the site** at **http://localhost:3000**

   The pages must be opened through this address. Opening the HTML files directly
   (double-clicking them) will not load any data, because the pages get their data from the server.

To stop the server, press `Ctrl + C` in the terminal.

## Try it

- **Apply:** Softball page → fill in the form → the new application appears in the `applications` collection.
- **Rent gear:** Equipment page → use the same team name you applied with.
- **Check status:** My Team page → try the sample team **Buffalo Herd** / **marcus@email.com**.
- **Reset:** re-run `mongo/seed-all.js` any time to go back to the sample data.

## API routes (server.js)

| Method | Route | What it does |
|---|---|---|
| GET | `/api/leagues` | All leagues |
| GET | `/api/equipment` | All rental equipment |
| GET | `/api/reviews` | All reviews |
| GET | `/api/myteam?teamName=...&email=...` | One team's application and gear request |
| POST | `/api/applications` | Save a team application |
| POST | `/api/rentals` | Save a gear request |
| POST | `/api/reviews` | Save a review |
| POST | `/api/messages` | Save a contact message |

## Project files

| File / folder | Purpose |
|---|---|
| `server.js` | Express server: serves the pages and the API routes |
| `*.html`, `style.css` | Pages and shared styling |
| `product.js`, `equipment.js`, `myteam.js`, `reviews.js`, `faq.js` | Page behavior; send and load data with `fetch()` |
| `nav.js`, `confirmbox.js` | Shared navigation highlight and confirm box |
| `images/` | Site photos |
| `mongo/` | Sample data (`seed-all.js`, JSON files) and the database field guide |

No passwords or keys are needed. The app connects only to a local MongoDB.