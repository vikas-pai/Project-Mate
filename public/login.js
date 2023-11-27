const submitForm = () => {
  const Uname = document.getElementById("username");
  const Upassword = document.getElementById("password");
  console.log(Uname.value.length, Upassword.value.length);
  if (Uname.value.length === 0 || Upassword.value.length === 0) {
    alert("Please provide all values");
  } else {
    let inputObj = {
      "username": Uname.value,
      "password": Upassword.value,
    };

    fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputObj),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          alert(data["msg"]);
          const error = data;
          return Promise.reject(error);
        } else {
          
          let Token = data.token;
          localStorage.setItem("token", Token);
          window.location.replace("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

