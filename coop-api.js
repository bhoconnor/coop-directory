// FILE PURPOSE: Main API code

// No longer need jsdom
// // To import & use jsdom to allow a version of the DOM
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const dom = new JSDOM(`<!DOCTYPE html><p>Test</p>`);
// console.log(dom.window.document.querySelector("p").textContent);

// To import the Express framework
const express = require("express");
// Middleware that helps decode the body from an HTTP request
const bodyParser = require("body-parser");
// Middleware that helps because the API will be called from different locations (CORS = cross-origin resource sharing)
const cors = require("cors");

// To set up SQLite as database
const sqlite3 = require("sqlite3").verbose();
// Creates or opens a new file for this data. Since there's no path, need to keep file in the same directory where the program is running.
const db = new sqlite3.Database("primary.db");

// To instantiate the Express app
const app = express();
const port = 3000;

// Where co-ops will be kept
let coops = [];

app.use(cors());

// To configure body parser middleware using default "body type" for forms, to allow it to "grab the HTTP body, decode the information, & append it to the req.body," allowing ability to retrieve info from the form (see "req.body" in app.post method below).
app.use(bodyParser.urlencoded({ extended: false }));
// Used when requesting a resource using jQuery or backend REST client
app.use(bodyParser.json());

// To host the front-end files
app.use(express.static("html"));

// To add a new coop to the coop array
app.post("/coop", (req, res) => {
  // Variable for body
  const coop = req.body;

  // Output the coop to the console for debugging
  console.log(coop);
  // Commented out below eventually since using SQL & didn't need after all
  // coops.push(coop);

  // This INSERT INTO statement adds a row to tables (first list is column names, 2nd is values)
  let sql = `insert into coops (coop_number, coop_name, date_now, submitter_first_name, submitter_last_name, coop_country, coop_city, coop_website) VALUES (?, '${coop.name}', '${coop.date}', '${coop.firstName}','${coop.lastName}', '${coop.country}', '${coop.city}', '${coop.website}');`;

  // Dump sql to check
  console.log(sql);

  // Run sql query
  db.run(sql, coop.coop_number);

  // To send HTTP response about adding co-op
  res.send(
    "Co-op is added to the database--close this window & refresh the previous page to see it in the overall list."
  );
});

// // ADDED//////////////////////////////////////////////////////////
// // To stringify searchValue from browser
// const searchValueString = JSON.stringify(searchValue);

// // [TEMP COMMENT] STEPS TO SET UP FILTER:
// // 1) Change "SELECT * FROM" command to "SELECT * FROM coops WHERE name=req.params.name" (and convert name to string literal to make a variable) so it selects based on what's searched;

// // 2) [DONE] Build raw HTML Search;

// // 3) If-else (eg, if there's a parameter, show that, if not leave what's there)...in written form, it might be, i'll try if searchValue != "" then...

// // EDIT 2: With if-else

// Receiving the GET request from the browser (in coop-list.js), which is requesting filtered co-ops from API based on search term (or based on no search term if there isn't one (which is considered "undefined" below))
app.get("/coops-filter", (req, res) => {
  // No longer need below line, since we're using the database.
  // res.json(coops);
  console.log(JSON.stringify(req.query));
  if (req.query.name != undefined) {
    // Show search results on page
    db.all(
      // Selection below includes "like" operator to allow for search terms to equal part of a name (https://www.w3schools.com/sql/sql_like.asp); the % symbols allow for whatever other terms in database before & after query name search.
      `SELECT * FROM coops WHERE UPPER(coop_name) like '%${req.query.name.toUpperCase()}%'`,
      (err, rows) => {
        console.log(err);
        console.log(JSON.stringify(rows));
        // Create an empty array to store the co-ops we get from database
        let coopsFromDb = [];
        // Add each row from the database tables to the array
        for (let row of rows) {
          coopsFromDb.push({
            coop_number: row.coop_number,
            name: row.coop_name,
            date: row.date_now,
            firstName: row.submitter_first_name,
            lastName: row.submitter_last_name,
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
    // ORIGINAL To get all coops from API
    db.all("SELECT * FROM coops", (err, rows) => {
      console.log(JSON.stringify(rows));
      // Create an empty array to store the co-ops we get from database
      let coopsFromDb = [];
      // Add each row from the database tables to the array
      for (let row of rows) {
        coopsFromDb.push({
          coop_number: row.coop_number,
          name: row.coop_name,
          date: row.date_now,
          firstName: row.submitter_first_name,
          lastName: row.submitter_last_name,
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

// // ORIGINAL To get all coops from API
app.get("/coops", (req, res) => {
  // No longer need below line, since we're using the database.
  // res.json(coops);

  db.all("SELECT * FROM coops", (err, rows) => {
    console.log(JSON.stringify(rows));
    // Create an empty array to store the co-ops we get from database
    let coopsFromDb = [];
    // Add each row from the database tables to the array
    for (let row of rows) {
      coopsFromDb.push({
        coop_number: row.coop_number,
        name: row.coop_name,
        date: row.date_now,
        firstName: row.submitter_first_name,
        lastName: row.submitter_last_name,
        country: row.coop_country,
        city: row.coop_city,
        website: row.coop_website,
      });
    }

    // return those elements
    res.json(coopsFromDb);
  });
});
// Edit a given co-op
// Never got this to work...
app.post("/coop/:coop_number", (req, res) => {
  // Reading co-op number from the URL
  const coop_number = req.params.coop_number;
  const newCoop = req.body;

  // Remove item from the coops array
  for (let i = 0; i < coops.length; i++) {
    let coop = coops[i];
    if (coop.coop_number === coop_number) {
      coops[i] = newCoop;
    }
  }

  res.send("Co-op is edited");
});

// Use URL with coop_number to retrieve a specific co-op
// Never got this to work...
app.get("/coop/:coop_number", (req, res) => {
  // Reading coop_number from the URL
  const coop_number = req.params.coop_number;

  // Searching co-ops for the coop_number
  for (let coop of coops) {
    if (coop.coop_number === coop_number) {
      res.json(coop);
      return;
    }
  }

  // Sending 404 when not found
  res.status(404).send("Co-op not found");
});

app.delete("/coop/:coop_number", (req, res) => {
  // Defining variable coop_number for end of above URL
  const coop_number = req.params.coop_number;
  // Not needed anymore because we are reading from sql
  // // Remove item from the coops array
  // coops = coops.filter(i => {
  //     if (i.coop_number !== coop_number) {
  //         return true;
  //     }
  //     return false;
  // });

  db.run(`delete from coops where coop_number='${coop_number}'`);

  res.send("Co-op is deleted");
});

// Creates the table each time if it doesn't exist yet
db.run(
  "CREATE TABLE if not exists coops (coop_number TEXT, coop_name TEXT, date_now TEXT, submitter_first_name TEXT, submitter_last_name TEXT, coop_country TEXT, coop_city TEXT, coop_website TEXT)"
);

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
