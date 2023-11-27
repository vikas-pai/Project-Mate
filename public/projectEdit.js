var projectid = new URL(window.location.href).pathname.split("/")[2];
fetch(`http://localhost:5000/api/v1/getProjectDetails?projectId=${projectid}`, {
  method: "GET",
})
  .then((data) => data.json())
  .then((data) => setProjectDetails(data));
function setProjectDetails(data) {
    console.log(data);
    var project = data.results[0];
    document.getElementById("project-name").innerHTML += project.projectname;
    document.getElementById("project-version").value = project.projectversion;
    document.getElementById("issueCount").innerHTML += project.issuecount;
    }
document.getElementById("editProject").addEventListener("click", function () {
    var projectVersion = document.getElementById("project-version").value;
    var data = {
      projectid,
      projectVersion,
    };
    console.log(data);
    fetch("http://localhost:5000/api/v1/updateProject", {
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