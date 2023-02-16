// FILE PURPOSE: Main API code, on the server side as they always are, has various functions such as receiving new co-ops to add to database, sending co-ops in database to browser, deleting co-ops, as well as initiating overall Express app & database, etc.

// ****************************************************************************************************************
// Setting up middleware and related tools (eg, Express framework, SQLite, etc.).
// ****************************************************************************************************************

// To import the Express framework (which is how Node communicates over the web)
const express = require("express");
// Middleware that helps decode the body from an HTTP request`
const bodyParser = require("body-parser");
// Middleware that helps because the API will be called from different locations (CORS = cross-origin resource sharing)
const cors = require("cors");
// Middleware that allows to serve static CSS files to the clients
const path = require("path");

// To set up SQLite as database
const sqlite3 = require("sqlite3").verbose();
// Creates or opens a new file for this data. Since there's no path, need to keep file in the same directory where the program is running.
const db = new sqlite3.Database("primary.db");

// To instantiate the Express app
const app = express();
const port = 3000;

// // Array where co-ops will be kept (not needed b/c using database)
// let coops = [];

app.use(cors());

// To configure body parser middleware using default "body type" for forms, to allow it to "grab the HTTP body, decode the information, & append it to the req.body," allowing ability to retrieve info from the form (see "req.body" in app.post method below).
app.use(bodyParser.urlencoded({ extended: false }));
// Used when requesting a resource using jQuery or backend REST client
app.use(bodyParser.json());
// To host the front-end files
app.use(express.static("html"));
// To serve the static (at least CSS) files to the clients
app.use(express.static(path.join(__dirname, "public")));

// ****************************************************************************************************************
// TO ADD A NEW COOP TO THE COOP DATABASE
// ****************************************************************************************************************

// Below receives new co-op submission POST request (req) from browser/index.html
app.post("/coop", (req, res) => {
  // Variable for body within request from browser
  const coop = req.body;

  // // Output the coop to the console for debugging
  // console.log(coop)

  // This INSERT INTO statement adds a row to tables (first list is column names in SQL, 2nd is ID names in index.html)
  let sql = `insert into coops (coop_name, coop_type, platform_coop, industry, date_now, submitter_first_name, submitter_last_name, coop_country, coop_city, coop_website) VALUES ('${coop.name}', '${coop.coopType}', '${coop.platformCoop}', '${coop.industry}', '${coop.date}', '${coop.firstName}','${coop.lastName}', '${coop.country}', '${coop.city}', '${coop.website}');`;

  // Dump sql to check for problems or errors (turn on when needed)
  // console.log(sql);

  // Run sql query above to insert new co-op info into database (value/parameter after comma is pulled into list of values above in place of ?, if decide need parameter at whatever point); if duplicate co-op name error, then send error message, otherwise send success message.
  db.run(sql, (err) => {
    if (err) {
      // To send HTTP response about adding co-op (eventually handle the below 2 messages via HTML when posted)
      res.send(
        "Sorry that co-op is already in our system--close this window if you would like to return to the previous page."
      );
    } else {
      res.send(
        "Co-op is added to the database--close this window & refresh the previous page to see it in the overall list."
      );
    }
  });
});

// ****************************************************************************************************************
// TO SEND EXISTING COOPS IN DATABASE TO BROWSER BASED ON SEARCH VALUE
// ****************************************************************************************************************

// Below receives the GET request (req) from the browser (in coop-list.js), which is requesting filtered co-ops from API based on search term (or based on no search term if there isn't one (which is considered "undefined" below))
app.get("/coops-filter", (req, res) => {
  // No longer need below line, since we're using the database.
  // res.json(coops);
  // console.log(JSON.stringify(req.query));
  if (req.query.name != undefined) {
    // Show search results on page
    db.all(
      // Selection below includes "like" operator to allow for search terms to equal part of a name (https://www.w3schools.com/sql/sql_like.asp); the % symbols allow for whatever other terms in database before & after query name search.
      `SELECT * FROM coops WHERE UPPER(coop_name) like '%${req.query.name.toUpperCase()}%'`,
      (err, rows) => {
        // console.log(err);
        // console.log(JSON.stringify(rows));
        // Create an empty array to store the co-ops we get from database
        let coopsFromDb = [];
        // Add each row from the database tables to the array
        for (let row of rows) {
          coopsFromDb.push({
            coop_number: row.coop_number,
            name: row.coop_name,
            coop_type: row.coop_type,
            platform_coop: row.platform_coop,
            industry: row.industry,
            date: row.date_now,
            first_Name: row.submitter_first_name,
            last_Name: row.submitter_last_name,
            country: row.coop_country,
            city: row.coop_city,
            website: row.coop_website,
          });
        }
        // return those elements
        res.json(coopsFromDb);
      }
    );
  } else {
    // Show all coops on page
    db.all("SELECT * FROM coops", (err, rows) => {
      // console.log(JSON.stringify(rows));
      // Create an empty array to store the co-ops we get from database
      let coopsFromDb = [];
      // Add each row from the database tables to the array
      for (let row of rows) {
        coopsFromDb.push({
          coop_number: row.coop_number,
          name: row.coop_name,
          coop_type: row.coop_type,
          platform_coop: row.platform_coop,
          industry: row.industry,
          date: row.date_now,
          first_Name: row.submitter_first_name,
          last_Name: row.submitter_last_name,
          country: row.coop_country,
          city: row.coop_city,
          website: row.coop_website,
        });
      }
      // return those elements
      res.json(coopsFromDb);
    });
  }
});

// ****************************************************************************************************************
// TO DELETE COOPS FROM THE DATABASE
// ****************************************************************************************************************

app.delete("/coop/:coop_number", (req, res) => {
  // Defining variable coop_number for end of above URL
  const coop_number = req.params.coop_number;

  db.run(`delete from coops where coop_number='${coop_number}'`);

  res.send("Co-op is deleted");
});

// ****************************************************************************************************************
// Creates the table each time if table doesn't exist yet already (assigning coop_number based on autoincrement)
// ****************************************************************************************************************

db.run(
  "CREATE TABLE if not exists coops (coop_number INTEGER PRIMARY KEY AUTOINCREMENT, coop_name TEXT UNIQUE, coop_type TEXT, platform_coop TEXT, industry TEXT, date_now TEXT, submitter_first_name TEXT, submitter_last_name TEXT, coop_country TEXT, coop_city TEXT, coop_website TEXT)"
);

// BELOW STARTS ACTUAL API BY INSTRUCTING ABOVE APP TO LISTEN ON A PORT FOR ABOVE ENDPOINTS
app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
