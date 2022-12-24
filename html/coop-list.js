// FILE PURPOSE: To retrieve all co-ops using browser-side JS & REST API, so when each co-op is updated/deleted, it displays as a Bootstrap card or is removed from view.

const setEditModal = (coop_number) => {
  // Get info about the coop using number
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", `http://localhost:3000/coop/${coop_number}`, false);
  xhttp.send();

  const coop = JSON.parse(xhttp.responseText);

  // Assign these properties to "coop" variable
  const { name, date, firstName, lastName, country, city, website } = coop;

  // Filling info about the coop in the form inside the modal
  document.getElementById("coop_number").value = coop_number;
  document.getElementById("name").value = name;
  document.getElementById("date").value = date;
  document.getElementById("firstName").value = firstName;
  document.getElementById("lastName").value = lastName;
  document.getElementById("country").value = country;
  document.getElementById("city").value = city;
  document.getElementById("website").value = website;

  // Setting up the action url for the coop
  document.getElementById(
    "editForm"
  ).action = `http://localhost:3000/coop/${coop_number}`;
};

// To delete co-ops, uses DELETE to delete an entity from the server.
const deleteCoop = (coop_number) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("DELETE", `http://localhost:3000/coop/${coop_number}`, false);
  xhttp.send();

  // Reload the page
  location.reload();
};

// Search & Button variables
// Search variables
const input = document.getElementById("searchInput");
const searchValue = input.value;
// Button variable
const button = document.getElementById("submitButton");
// Console.log not working, why not?
console.log("Search value:", `${searchValue}`);

// To retrieve co-ops, based on search value if applicable, using GET to request data from the server.
const loadCoops = (searchValue) => {
  // Creating new object for request
  const xhttp = new XMLHttpRequest();

  // Opening request to server (coop-api.js)
  xhttp.open(
    "GET",
    `http://localhost:3000/coops-filter?name=${searchValue}`,
    false
  );

  // Sending request to server
  xhttp.send();

  // Receiving response text back from server (includes some or all co-ops depending on Search term)
  const coops = JSON.parse(xhttp.responseText);

  // Using response text from server to display co-ops
  for (let coop of coops) {
    // Sections for entries to display in website cards (after already entered by user in index.html)
    const x = `
      <div class="col-4">
        <div class="card">  
          <div class="card-body">
            <h3 class="card-title"><u>Co-op name</u>: ${coop.name}</h3>

            <div><strong>Co-op number</strong>: ${coop.coop_number}</div>
            <div><strong>Date today</strong>: ${coop.date}</div>
            <div><strong>First name</strong> (of person who submitted): ${coop.firstName}</div>
            <div><strong>Last name</strong> (of person who submitted): ${coop.lastName}</div>
            <div><strong>Country where co-op is located</strong>: ${coop.country}</div>
            <div><strong>City where co-op is located</strong>: ${coop.city}</div>
            <div>
              <strong>Co-op website</strong>: <a href="${coop.website}" target="_blank" class="link-primary">${coop.website}</a>
            </div>

            </br>

            <!--- To call function at top of this page -->
            <!--- Delete button -->
            <button type="button" class="btn btn-danger" onclick="deleteCoop('${coop.coop_number}')">Delete</button>

            <hr style = "border: 1px dashed"/>

          </div>
        </div>
      </div>
    `;

    // Removed this Edit button from where had it originally, right under Delete button above, until can work on it more:
    // <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editCoopModal onclick="setEditModal('${coop.coop_number}')">Edit (not currently working)</button>

    // With each co-op of the overall co-ops list of response text from the server, insert it into index.html (into "Co-op List section"), then after it add each additional co-op in that response text one at a time
    document.getElementById("coops").innerHTML =
      document.getElementById("coops").innerHTML + x;
  }
};

// SUMMARY:

// 1) Trying to get one of the below to work, & also to see if window.location.reload(); can be used in any of them.

// 2) Can currently only get: 1) all the co-ops to show; 2) only the search term-based co-ops to show; or 3) all the co-ops & the search term-based co-ops, & each search just adds to the list, doesn't replace it.

// 3) The 2 uncommented sections below together lead to scenario 3 above, albeit in a messy, over-coded way...all the commented out sections below that are attempts tried so far.

// 4) Seems my logic may be wrong. The logic scenario as i tried to write it out that i believe we want is: All co-ops show when first loaded. Then if someone types into search box & clicks Search button, server sends back new list of matching co-ops to replace old list--but not sure how to replace an old list...and/or how to use the location.reload(); function in some way...

// Below only working to show all co-ops, but not adding to list based on search
if (input.value) {
  // This reload didn't change how it functions
  // location.reload();
  // Load co-ops WITH a search
  button.addEventListener("click", (e) => {
    // Prevent form input from being lost after submission
    e.preventDefault();
    loadCoops(input.value);
  });
} else {
  // Load co-ops WITHOUT a search
  loadCoops(input.value);
}

// Below only working to show co-ops based on search, but keeps adding to list doesn't replace & doesn't show all co-ops at any point
if (document.readyState === "complete") {
  // Load co-ops WITH a search
  // Event listener for Search submission
  // button.addEventListener("click", (e) => {
  //   // Prevent form input from being lost after submission
  //   // e.preventDefault();
  //   return loadCoops(input.value);
  loadCoops(input.value);
} else {
  // Load co-ops WITHOUT a search
  button.onclick = function (e) {
    e.preventDefault();
    loadCoops(input.value);
  };
}

// // Below only working to show co-ops based on search, but keeps adding to list doesn't replace & doesn't show all co-ops at any point
// Load co-ops WITH a search
// button.addEventListener("click", (e) => {
//   if (input.value) {
//     // Prevent form input from being lost after submission
//     e.preventDefault();
//     loadCoops(input.value);
//   } else {
//     // Load co-ops WITHOUT a search
//     loadCoops(input.value);
//   }
// });

// // Below only working to show co-ops based on search, but keeps adding to list doesn't replace & doesn't show all co-ops at any point
// if (document.readyState !== "complete") {
//   // Load co-ops WITH a search
//   // Event listener for Search submission
//   // button.addEventListener("click", (e) => {
//   //   // Prevent form input from being lost after submission
//   //   // e.preventDefault();
//   //   return loadCoops(input.value);
//   button.onclick = function (e) {
//     e.preventDefault();
//     loadCoops(input.value);
//   };
// } else {
//   // Load co-ops WITHOUT a search
//   loadCoops(input.value);
// }

// // Below only working to show all co-ops, but not adding to list based on search
// if (input.value) {
//   // Load co-ops WITH a search
//   button.addEventListener("click", (e) => {
//     // Prevent form input from being lost after submission
//     e.preventDefault();
//     return loadCoops(input.value);
//   });
// } else {
//   // Load co-ops WITHOUT a search
//   loadCoops(input.value);
// }

// // Below only working to show all co-ops, but not adding to list based on search
// if (onclick) {
//   // Load co-ops WITH a search
//   button.addEventListener("click", (e) => {
//     // Prevent form input from being lost after submission
//     e.preventDefault();
//     return loadCoops(input.value);
//   });
// } else {
//   // Load co-ops WITHOUT a search
//   loadCoops(input.value);
// }

// // Below only working to show co-ops based on search, but keeps adding to list doesn't replace & doesn't show all co-ops at any point
// if (input.value !== undefined) {
//   // Load co-ops WITH a search
//   // Event listener for Search submission
//   // button.addEventListener("click", (e) => {
//   //   // Prevent form input from being lost after submission
//   //   // e.preventDefault();
//   //   return loadCoops(input.value);
//   button.onclick = function (e) {
//     e.preventDefault();
//     loadCoops(input.value);
//   };
// } else {
//   // Load co-ops WITHOUT a search
//   loadCoops(input.value);
// }

// // Below only working to show all co-ops, but not adding to list based on search
// if (input.value !== "") {
//   // Load co-ops WITH a search
//   // Event listener for Search submission
//   // button.addEventListener("click", (e) => {
//   //   // Prevent form input from being lost after submission
//   //   // e.preventDefault();
//   //   return loadCoops(input.value);
//   button.onclick = function (e) {
//     e.preventDefault();
//     return loadCoops(input.value);
//   };
// } else {
//   // Load co-ops WITHOUT a search
//   loadCoops(input.value);
// }
