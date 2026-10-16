# LeagueLine MongoDB data

Database: `leagueline` (local MongoDB, `localhost:27017`)

Every collection below holds sample documents whose field names and data types
match what the website shows or collects. MongoDB also gives every document an
automatic `_id`; the readable ids (`applicationId`, `itemId`, ...) are the ones
the website uses.

## Loading the data

**Option A, Compass buttons:** for each collection, create it in the `leagueline`
database, then **Add Data → Import JSON or CSV file** and pick the matching
`.json` file from this folder. Delete the old documents first if the collection
already has some.

**Option B, shell:** open the MongoDB shell in Compass (`>_` button), paste all of
`seed-all.js`, and press Enter. It clears and refills all six collections and
prints how many documents each has.

## Collections and where they appear on the site

| Collection | Website page | Shown or collected |
|---|---|---|
| `leagues` | Home (league cards), Softball | Shown |
| `equipment` | Equipment | Shown |
| `applications` | Softball (Apply form), My Team | Collected, then shown |
| `rentals` | Equipment (Request Gear), My Team | Collected, then shown |
| `reviews` | Reviews | Shown and collected |
| `messages` | FAQ (Contact form) | Collected |

## Field mapping

### leagues
| Field | Type | On the website |
|---|---|---|
| `leagueId` | String | Links applications to their league |
| `name` | String | "Fall 2026 Coed Softball League" heading |
| `season` | String | "Fall 2026" on the home league card |
| `location`, `gameDays`, `seasonWeeks` | String, Array of strings, Number | "10 week season - West Texas Rec Park - games on Saturdays and Sundays" |
| `feePerTeam` | Number | "$250 per team for the whole season" |
| `maxTeams`, `registeredTeams` | Number | "4 of 12 team spots remaining" |
| `minPlayers`, `maxPlayers` | Number | Team size check "10 to 20 players" |
| `status` | String: `open` / `coming-soon` | "Applications Open" / "Coming Soon" |
| `imageUrl` | String | League card photo |

### equipment
| Field | Type | On the website |
|---|---|---|
| `itemId` | String | Quantity box id (`qty-bat`) |
| `name` | String | Card title ("Bats") |
| `pricePerSeason` | Number | "$20.00 each, for the season" and the live total |
| `quantityAvailable` | Number | "15 available this season", max quantity allowed |
| `isAvailable` | Boolean | Out-of-stock items are greyed out |
| `details` | String | Hover details |
| `sizes` | Array of strings, or null | One quantity box per size on the item's card |
| `imageUrl` | String | Item photo |

### applications
| Field | Type | On the website |
|---|---|---|
| `applicationId` | String | Links rentals to the team |
| `teamName`, `managerName`, `managerEmail` | String | Apply form fields; My Team lookup |
| `teamSize` | Number | Apply form "Team Size" |
| `leagueId`, `leagueName` | String | League applied to |
| `status` | String: `pending` / `approved` | My Team tracker (Submitted / Approved) |
| `submittedAt` | Date | "Submitted Oct 15, 2026" |
| `leagueFee`, `feePaid` | Number, Boolean | My Team "Season Balance" |

### rentals
| Field | Type | On the website |
|---|---|---|
| `rentalId` | String | Unique id for the request |
| `applicationId` | String | Which team the gear belongs to |
| `status` | String: `pending` / `approved` / `fulfilled` | My Team tracker (Requested / Ready for pickup / Picked up) |
| `requestedAt` | Date | "Requested Sep 5, 2026" |
| `items` | Array of objects (`itemId`, `name`, `size`, `quantity`, `pricePerSeason`), one per item and size; `size` is null for items without sizes | Equipment "Your Request" lines; My Team gear table |
| `gearPaid` | Boolean | My Team "Season Balance" |

### reviews
| Field | Type | On the website |
|---|---|---|
| `reviewerName` | String | Feedback form "Your Name" |
| `rating` | Number (1-5) | Stars and the average rating |
| `comment` | String | Review text (20-300 characters) |
| `leagueId` | String | Which league the review is about |
| `createdAt` | Date | When it was posted |

### messages
| Field | Type | On the website |
|---|---|---|
| `senderName`, `senderEmail` | String | Contact form name and email |
| `topic` | String: `league` / `equipment` / `payment` / `other` | Contact form "Topic" dropdown values |
| `message` | String | Contact form message |
| `sentAt` | Date | When it was sent |
| `status` | String: `new` / `answered` | For the league office to track replies |

## How the collections connect

- `applications.leagueId` → `leagues.leagueId`
- `rentals.applicationId` → `applications.applicationId`
- `rentals.items[].itemId` → `equipment.itemId`
- `rentals.items[].size` → one of that item's `equipment.sizes`

Until the Node/Express server exists, new applications, gear requests, and reviews are saved
in the browser (`localStorage`, see `teamdata.js`) using these same fields.
