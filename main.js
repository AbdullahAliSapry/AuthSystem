
window.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (
    user &&
    (window.location.pathname == "/Register.html" ||
      window.location.pathname == "/login.html")
  ) {
    window.location.href = "/index.html";
  } else if (user == null && window.location.pathname == "/index.html") {
    window.location.pathname = "/login.html";
  }
});
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function showToast(message, isSuccess = true) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: isSuccess ? "#4caf50" : "#f44336",
  }).showToast();
}

const RegisterHandler = () => {
  console.warn("enter register");
  const form = document.querySelector(".RegisterForm");
  const errorMessages = form.querySelectorAll(".error-message");

  const submitHandler = async (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    let IsPassed = true;
    let TestEmailRegexIsPassed = emailRegex.test(email);

    errorMessages.forEach((message) => (message.textContent = ""));

    if (name === "") {
      errorMessages[0].textContent = "Name is required";
      IsPassed = false;
      return;
    }

    if (!TestEmailRegexIsPassed) {
      errorMessages[1].textContent = "Invalid email format";
      IsPassed = false;
      return;
    }

    if (password === "") {
      errorMessages[2].textContent = "Password is required";
      IsPassed = false;
      return;
    }

    if (password.length < 8) {
      errorMessages[2].textContent =
        "Password must be at least 8 characters long";
      IsPassed = false;
      return;
    }
    if (password !== confirmPassword) {
      errorMessages[3].textContent = "Passwords do not match";
      IsPassed = false;
      return;
    }

    const AddInnDb = async ({ name, email, password }) => {
      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
        showToast("register success");
      } catch (error) {
        console.error("error adding user: ", error);
        showToast("Error in register", false);
      }
    };
    const isEmailUnique = async (email) => {
      const response = await fetch(
        `http://localhost:3000/users?email=${email}`
      );
      const users = await response.json();
      return users.length === 0;
    };
    if (IsPassed) {
      const user = {
        name: name,
        email: email,
        password: password,
      };
      var isUniq = await isEmailUnique(user.email);

      if (isUniq) {
        AddInnDb(user);
      } else {
        showToast("Email is already registered", false);
      }
    }
  };

  form.addEventListener("submit", submitHandler);
};

const LoginHandler = () => {
  const form = document.querySelector(".LoginForm");
  const errorMessages = form.querySelectorAll(".error-message");

  const SubmitLoginHandler = async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let IsPassed = true;

    errorMessages.forEach((message) => (message.textContent = ""));

    if (email === "") {
      errorMessages[0].textContent = "Email is required";
      IsPassed = false;
      return;
    }
    if (!emailRegex.test(email)) {
      errorMessages[0].textContent = "Invalid email format";
      IsPassed = false;
      return;
    }
    if (password === "") {
      errorMessages[1].textContent = "Password is required";
      IsPassed = false;
      return;
    }

    const Login = async (email, password) => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/?email=${email}&password=${password}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const users = await response.json();
        return users;
      } catch (error) {
        return null;
      }
    };

    if (IsPassed) {
      const users = await Login(email, password);
      if (users.length > 0) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: users[0].name,
            email: users[0].email,
            id: users[0].id,
          })
        );
        window.location.href = "index.html";
      } else {
        showToast("Invalid email or password", false);
      }
    }
  };

  form.addEventListener("submit", SubmitLoginHandler);
};

if (window.location.pathname == "/Register.html") {
  RegisterHandler();
} else if (window.location.pathname == "/login.html") {
  LoginHandler();
}

if (
  window.location.pathname == "/index.html" ||
  window.location.pathname == "/"
) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    var userName = document.querySelector(".username");
    var Email = document.querySelector(".useremail");
    userName.textContent = user.name;
    Email.textContent = user.email;
    const btn = document.querySelector(".logoutBtn");

    const logout = () => {
      localStorage.removeItem("user");
      window.location.href = "/login.html";
    };
    btn.addEventListener("click", logout);
  } else {
    window.location.href = "/login.html";
  }
}
