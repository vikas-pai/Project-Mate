fetch("http://localhost:5000/api/v1/getAllProjects", { method: "GET" })
  .then((data) => data.json())
  .then((data) => setProjects(data));
function setProjects(data) {
  console.log(data.results);
  var results = data.results;
  var htmlString = "";
  for (var i = 0; i < results.length; i++) {
    htmlString += `
      <div class="issue-card" id="issue-${results[i].projectid}">
      <a class="link-nocolor" href="http://localhost:5000/project/${results[i].projectid}">
      <div class="issue-card-content">
        <h2 class="project-name">${results[i].projectname}</h2>
        <p class="project-version">
          Project Version: ${results[i].projectversion}
        </p>
        <p>IssueCount: ${results[i].issuecount}</p>
      </div>
    </div>`;
  }
  document.getElementById("projects").innerHTML = htmlString;
}
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