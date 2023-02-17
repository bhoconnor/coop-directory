// FILE PURPOSE: To retrieve all co-ops using browser-side JS & REST API, so when each co-op is updated/deleted, it displays as a Bootstrap card or is removed from view.

// ****************************************************************************************************************
// To delete co-ops, uses DELETE to delete an entity from the server./////////////////////////////////////////////////////////////////
// ****************************************************************************************************************

const deleteCoop = (coop_number) => {
  // Creating new object for request
  const xhttp = new XMLHttpRequest();

  // Opening request to server (coop-api.js)
  xhttp.open("DELETE", `http://localhost:3000/coop/${coop_number}`, false);

  // Sending request to server
  xhttp.send();

  // Reload the page
  location.reload();
};

// ****************************************************************************************************************
// Search & Button variables///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ****************************************************************************************************************

// Search variables
const input = document.getElementById("searchInput");
const searchValue = input.value;
// Button variable
const button = document.getElementById("submitButton");

// ****************************************************************************************************************
// To retrieve co-ops, *based on search value* if applicable, using GET to request data from the server.///////////////////////////////////////////
// ****************************************************************************************************************

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

  // Parsing JSON-formatted response text back from server (includes some or all co-ops depending on Search term)
  const coops = JSON.parse(xhttp.responseText);

  // Sets innerHTML back to empty (so doesn't keep adding new searched items or database list to co-ops on screen)
  document.getElementById("coops").innerHTML = "";

  // Using response text from server to display co-ops
  for (let coop of coops) {
    // Sections for entries to display in website cards (after already entered by user in index.html)

    // NOTE: Names below come from adding row names to prefix "coop." based on row names in coop-api.js (in the section with the header starting "TO SEND EXISTING COOPS IN DATABASE")
    const x = `
      <div class="col-4 tab">
        <div class="card">  
          <div class="card-body">
            <h3 class="card-title"><u>Co-op name</u>: ${coop.name}</h3>

            <div><em>Co-op basics</em></div>
            <div><strong>Co-op Type</strong>: ${coop.coop_type}</div>
            <div><strong>Platform Co-op?</strong> ${coop.platform_coop}</div>
            <div><strong>Industry</strong>: ${coop.industry}</div>
            <div><strong>Country where co-op is located</strong>: ${coop.country}</div>
            <div><strong>City where co-op is located</strong>: ${coop.city}</div>
            <div>
              <strong>Co-op website</strong>: <a href="${coop.website}" target="_blank" class="link-primary">${coop.website}</a>
          </div>
            <div>------------------------------------</div>
            <div><em>Submission details</em></div>
            <div><strong>Co-op submission number</strong>: ${coop.coop_number}</div>
            <div><strong>Date of submission</strong>: ${coop.date}</div>
            <div><strong>Name</strong> (of person who submitted): ${coop.first_Name} ${coop.last_Name}</div>
            
            </br>

            <!--- To call function at top of this page -->
            <!--- Delete button -->
          <div class="tab">
            <button type="button" class="btn btn-danger" onclick="deleteCoop('${coop.coop_number}')">Delete</button>
          </div>

            <hr style = "border: 1px dashed"/>

          </div>
        </div>
      </div>
    `;

    // With each co-op of the overall co-ops list of response text from the server, insert the "x" variable version of it above into index.html (into "Co-op List section" with ID "coops"), then after it, add each additional co-op in that response text one at a time.
    document.getElementById("coops").innerHTML =
      document.getElementById("coops").innerHTML + x;
  }
};

// ****************************************************************************************************************
// TO LOAD CO-OPS BASED ON OVERALL LIST OF CO-OPS *AND* SEARCH TERMS.//////////////////////////////////////////////
// ****************************************************************************************************************
// The logic implemented below is something to the effect of: All co-ops show when first loaded. Then if someone types into search box & clicks Search button, server sends back new list of matching co-ops to replace old list.

// Below shows *all co-ops*, replacing whatever was shown before based on section above that sets innerHTML back to empty
if (input.value) {
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

// Below shows co-ops *based on search*, replacing whatever was shown before based on section above that sets innerHTML back to empty
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

// ****************************************************************************************************************
// COPYRIGHT & FOOTER////////////////////////////////////////////////////////////////////////////////////
// ****************************************************************************************************************
// Relevant variables
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector("footer");
const copyright = document.createElement("p");

// Copyright
copyright.innerHTML = "&nbsp;&nbsp;&copy; Brendan O'Connor, " + thisYear;
// Append copyright to footer
footer.appendChild(copyright);
