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

// To retrieve co-ops, uses GET to request data from the server.
const loadCoops = () => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "http://localhost:3000/coops", false);
  xhttp.send();

  const coops = JSON.parse(xhttp.responseText);

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

    // Loads list of co-ops into "Co-op List section" in index.html
    document.getElementById("coops").innerHTML =
      document.getElementById("coops").innerHTML + x;
  }
};

loadCoops();
