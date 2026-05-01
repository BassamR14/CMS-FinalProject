import { register, login, logout, getMe } from "./api.js";

//Query Selects
const container = document.querySelector(".container");
const nav = document.querySelector("nav");
const navLogin = document.querySelector(".nav-login-btn");

//Helper Functions
function clearContainer() {
  container.innerHTML = "";
}

function handleLogout() {
  logout();
  updateNav();
}

async function updateNav() {
  // Remove any previously added nav buttons
  const existingBtn = nav.querySelector(".admin-btn, .profile-btn");
  if (existingBtn) existingBtn.remove();

  const token = localStorage.getItem("token");

  if (token) {
    navLogin.innerText = "Log Out";
    navLogin.removeEventListener("click", renderLoginPage);
    navLogin.addEventListener("click", handleLogout);

    const user = await getMe();

    if (user.isAdmin) {
      const adminBtn = document.createElement("button");
      adminBtn.classList.add("admin-btn");
      adminBtn.innerText = "Admin";
      nav.prepend(adminBtn);
    } else {
      const profileBtn = document.createElement("button");
      profileBtn.classList.add("profile-btn");
      profileBtn.innerText = "Profile";
      nav.prepend(profileBtn);
    }
  } else {
    navLogin.innerText = "Log In";
    navLogin.removeEventListener("click", handleLogout);
    navLogin.addEventListener("click", renderLoginPage);
  }
}

//Render Functions
function renderLoginPage() {
  clearContainer();
  //DOM
  const page = document.createElement("div");

  const loginForm = document.createElement("form");
  const labelOne = document.createElement("label");
  const inputUsername = document.createElement("input");
  const labelTwo = document.createElement("label");
  const inputPassword = document.createElement("input");
  const loginBtn = document.createElement("button");
  const text = document.createElement("p");
  const registerBtn = document.createElement("button");

  labelOne.innerText = "Username: ";
  inputUsername.classList.add("username-input");
  labelTwo.innerText = "Password: ";
  inputPassword.type = "password";
  inputPassword.classList.add("password-input");
  loginBtn.innerText = "Log In";
  loginBtn.classList.add("login-btn");
  loginBtn.type = "button";
  text.innerText = "If you have no account, ";
  registerBtn.innerText = "Register here";
  registerBtn.classList.add("register-btn");
  registerBtn.type = "button";

  labelOne.append(inputUsername);
  labelTwo.append(inputPassword);
  text.append(registerBtn);
  loginForm.append(labelOne, labelTwo, loginBtn, text);
  page.append(loginForm);
  container.append(page);

  //Functionality

  registerBtn.addEventListener("click", renderRegisterPage);

  loginBtn.addEventListener("click", async () => {
    const username = inputUsername.value;
    const password = inputPassword.value;
    await login(username, password);
    updateNav();
  });
}

function renderRegisterPage() {
  clearContainer();
  //DOM
  const page = document.createElement("div");

  const registerForm = document.createElement("form");
  const labelOne = document.createElement("label");
  const inputUsername = document.createElement("input");
  const labelTwo = document.createElement("label");
  const inputEmail = document.createElement("input");
  const labelThree = document.createElement("label");
  const inputPassword = document.createElement("input");
  const loginBtn = document.createElement("button");
  const text = document.createElement("p");
  const registerBtn = document.createElement("button");

  labelOne.innerText = "Username: ";
  inputUsername.classList.add("username-input");
  labelTwo.innerText = "Email: ";
  inputEmail.type = "email";
  inputEmail.classList.add("email-input");
  labelThree.innerText = "Password: ";
  inputPassword.type = "password";
  inputPassword.classList.add("password-input");
  loginBtn.innerText = "Log In";
  loginBtn.classList.add("login-btn");
  loginBtn.type = "button";
  text.innerText = "If you have an account, ";
  registerBtn.innerText = "Register here";
  registerBtn.classList.add("register-btn");
  registerBtn.type = "button";

  labelOne.append(inputUsername);
  labelTwo.append(inputEmail);
  labelThree.append(inputPassword);
  text.append(loginBtn);
  registerForm.append(labelOne, labelTwo, labelThree, registerBtn, text);
  page.append(registerForm);
  container.append(page);

  //Functionality
  loginBtn.addEventListener("click", renderLoginPage);

  registerBtn.addEventListener("click", async () => {
    const username = inputUsername.value;
    const email = inputEmail.value;
    const password = inputPassword.value;
    await register(username, email, password);
    updateNav();
  });
}

//Page Load
function onPageLoad() {
  updateNav();
}
onPageLoad();
