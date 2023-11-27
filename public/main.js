// Function to open the modal
import { formatDate } from "/utils.js";

function setCards(data) {
  console.log(data.results);
  var results = data.results;
  var htmlString = "";
  for (var i = 0; i < results.length; i++) {
    var date = "";
    if (results[i].duedate == null) {
      date = "TBD";
    } else {
      date = formatDate(results[i].duedate);
    }

    htmlString += `
    <div class="issue-card" id="issue-${results[i].issueid}">
    <a class="link-nocolor" href="http://localhost:5000/issue/${results[i].issuename}">
    <div class="issue-card-content">
      <h2 class="issue-name">${results[i].issuename}</h2>
      <p class="issue-summary">
        Summary: ${results[i].summary}
      </p>
      <p>Due Date: ${date}</p>
      <p>Assignee: ${results[i].username}</p>
    </div>
  </div>`;
  }
  document.getElementById("issues").innerHTML = htmlString;
}
function setProjects(data) {
  //console.log(data.results);
  var results = data.results;
  var htmlString = `<option value="allprojects">All Projects</option>`;
  for (var i = 0; i < results.length; i++) {
    htmlString += `<option value="${results[i].projectid}">${results[i].projectname}</option>`;
  }
  document.getElementById("projectnames").innerHTML = htmlString;
}

function setProjectsinIssue(data) {
  var results = data.results;
  var htmlString = "";
  for (var i = 0; i < results.length; i++) {
    htmlString += `<option value="${results[i].projectid}">${results[i].projectname}</option>`;
  }
  document.getElementById("projectNameInIssue").innerHTML = htmlString;
}
function setUsersinIssue(data) {
  var results = data.results;
  var htmlString = "<option value='Unassigned'>Unassigned</option>";
  for (var i = 0; i < results.length; i++) {
    htmlString += `<option value="${results[i].userid}">${results[i].username}</option>`;
  }
  document.getElementById("assigneeInIssue").innerHTML = htmlString;
}
document.getElementById("green-button").addEventListener("click", function () {
  document.getElementById("createIssueModal").style.display = "block";
  fetch("http://localhost:5000/api/v1/getAllProjects", { method: "GET" })
    .then((data) => data.json())
    .then((data) => setProjectsinIssue(data));
  fetch("http://localhost:5000/api/v1/getAllUsers", { method: "GET" })
    .then((data) => data.json())
    .then((data) => setUsersinIssue(data));
});
document
  .getElementById("closeIssueModal")
  .addEventListener("click", function () {
    document.getElementById("createIssueModal").style.display = "none";
  });

function closeIssueModal() {
  document.getElementById("createIssueModal").style.display = "none";
}
window.onclick = function (event) {
  if (event.target == document.getElementById("createIssueModal")) {
    closeIssueModal();
  }
};
var issueFilterDefault = "myissues";
var projectFilterDefault = "allprojects";
fetch(
  `http://localhost:5000/api/v1/getAllIssues?issueType=${issueFilterDefault}&projectType=${projectFilterDefault}`,
  { method: "GET" }
)
  .then((data) => data.json())
  .then((data) => setCards(data));
fetch("http://localhost:5000/api/v1/getAllProjects", { method: "GET" })
  .then((data) => data.json())
  .then((data) => setProjects(data));
// document.getElementById("createIssue").addEventListener("click", () => {
//   openCreateIssueModal();
// });
document.getElementById("logout").addEventListener("click", () => {
  logoutUser();
});
function logoutUser() {
  localStorage.removeItem("token");
  fetch("http://localhost:5000/api/v1/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        alert(data["msg"]);
        const error = response.data;
        return Promise.reject(error);
      } else {
        window.location.replace("/login");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
function issueFilter() {
  var selectedProject = document.getElementById("projectnames").value;
  var selectedIssue = document.getElementById("issuenames").value;

  console.log(selectedProject, selectedIssue, "selected");

  fetch(
    `http://localhost:5000/api/v1/getAllIssues?issueType=${selectedIssue}&projectType=${selectedProject}`,
    { method: "GET" }
  )
    .then((data) => data.json())
    .then((data) => setCards(data));
}
document.getElementById("projectnames").addEventListener("change", () => {
  issueFilter();
});
document.getElementById("issuenames").addEventListener("change", () => {
  issueFilter();
});

function openModal() {
  document.getElementById("myModal").style.display = "flex";
}

// Function to close the modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

// Close the modal if the user clicks outside the modal content
window.onclick = function (event) {
  if (event.target == document.getElementById("myModal")) {
    closeModal();
  }
};
document
  .getElementById("submitIssueModal")
  .addEventListener("click", function () {
    var form = document.forms["my-form"];
    var issueSummary = form["issue-summary"].value;
    var issueDueDate = form["issue-due-date"].value;
    var projectName = form["projectNameInIssue"].value;
    var issueDesc = form["issue-description"].value;
    var assigneeName = document.getElementById("assigneeInIssue").value;
    var issuePriority = document.getElementById("priority").value;
    var issueType = document.getElementById("issue-type").value;
    console.log(
      projectName,
      issuePriority,
      issueSummary,
      issueDueDate,
      assigneeName,
      issueDesc,
      issueType
    );
    if (issueSummary.length == 0) {
      alert("Please provide all values");
    } else {
      var inputObj = {
        projectName: projectName,
        issuePriority: issuePriority,
        issueSummary: issueSummary,
        issueDueDate: issueDueDate,
        assigneeName: assigneeName,
        issueDesc: issueDesc,
        issueType: issueType,
      };

      fetch("http://localhost:5000/api/v1/createIssue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputObj),
      })
        .then((response) => {
          if (!response.ok) {
            alert(data["msg"]);
            const error = response.data;
            return Promise.reject(error);
          } else {
            window.location.replace("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      document.getElementById("createIssueModal").style.display = "none";
    }
  });




  document
  .getElementById("closeIssueModal")
  .addEventListener("click", function () {
    document.getElementById("createIssueModal").style.display = "none";
  });

function closeIssueModal() {
  document.getElementById("createIssueModal").style.display = "none";
}
window.onclick = function (event) {
  if (event.target == document.getElementById("createIssueModal")) {
    closeIssueModal();
  }
};

document.getElementById("myModal").addEventListener("click", function () {
  document.getElementById("").style.display = "none";
});
function openModal() {
  document.getElementById("myModal").style.display = "flex";
}

// Function to close the modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

// Close the modal if the user clicks outside the modal content
window.onclick = function (event) {
  if (event.target == document.getElementById("myModal")) {
    closeModal();
  }
};