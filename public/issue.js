import { formatDate1 } from "./utils.js";
var issueName = new URL(window.location.href).pathname.split("/")[2];
console.log(issueName);
fetch(`http://localhost:5000/api/v1/getIssueDetails?issueName=${issueName}`, {
  method: "GET",
})
  .then((data) => data.json())
  .then((data) => setIssueDetails(data));
function setIssueDetails(data) {
  console.log(data);
  var issue = data.results[0];
  var date = formatDate1(issue.duedate);
  document.getElementById("issueName").innerHTML += issue.issuename;
  document.getElementById("project-name").innerHTML += issue.projectname;
  document.getElementById("issue-summary").value = issue.summary;
  document.getElementById("issue-description").value = issue.description;
  document.getElementById("issue-type").value = issue.issuetype;
  document.getElementById("priority").value = issue.priority;
  document.getElementById("issue-due-date").value = date;
  document.getElementById("assigneeId").value = issue.assigneeid;
  document.getElementById("reporterId").value = issue.reporterid;
  document.getElementById("affectVersion").value = issue.affectversion;
  document.getElementById("fixedVersion").value = issue.fixedversion;
}
document.getElementById("editIssue").addEventListener("click", function () {
  var issueSummary = document.getElementById("issue-summary").value;
  var issueDesc = document.getElementById("issue-description").value;
  var issueType = document.getElementById("issue-type").value;
  var issuePriority = document.getElementById("priority").value;
  var issueDueDate = document.getElementById("issue-due-date").value;
  var assigneeName = document.getElementById("assigneeId").value;
  var affectVersion = document.getElementById("affectVersion").value;
  var fixedVersion = document.getElementById("fixedVersion").value;
  var reporterId = document.getElementById("reporterId").value;
  var data = {
    issueName,
    issueSummary,
    issueDesc,
    issueType,
    issuePriority,
    issueDueDate,
    assigneeName,
    affectVersion,
    fixedVersion,
    reporterId,
  };
  console.log(data);
  fetch("http://localhost:5000/api/v1/updateIssue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
});
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