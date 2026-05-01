import { register, login, logout, getMe, getBooks, saveBook } from "./api.js";

//Query Selects
const container = document.querySelector(".container");
const nav = document.querySelector("nav");
const navLogin = document.querySelector(".nav-login-btn");
const homepage = document.querySelector("h1");

homepage.addEventListener("click", renderHome);

//Helper Functions
function clearContainer() {
  container.innerHTML = "";
}

function handleLogout() {
  logout();
  updateNav();
  renderHome();
}

async function updateNav() {
  // Remove any previously added nav buttons
  const existingBtn = nav.querySelector(".admin-btn, .profile-btn");
  if (existingBtn) existingBtn.remove();

  const existingProfileName = nav.querySelector(".login-text");
  if (existingProfileName) existingProfileName.remove();

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

    const loginText = document.createElement("p");
    loginText.classList.add("login-text");
    loginText.innerText = `Logged in as: ${user.username}`;
    nav.append(loginText);
  } else {
    navLogin.innerText = "Log In";
    navLogin.removeEventListener("click", handleLogout);
    navLogin.addEventListener("click", renderLoginPage);
  }
}

function checkIfWishlisted(user, book, wishlistBtn) {
  if (user && user.to_read.some((b) => b.documentId === book.documentId)) {
    wishlistBtn.innerText = ` ✓In "To Read" List `;
    wishlistBtn.disabled = true;
  }
}

async function handleWishlistClick(token, book, wishlistBtn) {
  if (token) {
    await saveBook(book.documentId);
    wishlistBtn.innerText = `✓ In "To Read" List`;
    wishlistBtn.disabled = true;
  } else {
    renderLoginPage();
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
  inputUsername.classList.add("username-input");
  const labelTwo = document.createElement("label");
  const inputPassword = document.createElement("input");
  inputPassword.classList.add("password-input");
  const loginBtn = document.createElement("button");
  loginBtn.classList.add("login-btn");
  const text = document.createElement("p");
  const registerBtn = document.createElement("button");

  labelOne.innerText = "Username: ";
  labelTwo.innerText = "Password: ";
  inputPassword.type = "password";
  loginBtn.innerText = "Log In";
  loginBtn.type = "submit";
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

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = inputUsername.value;
    const password = inputPassword.value;
    const result = await login(username, password);
    if (result.error) {
      const errorMsg = document.createElement("p");
      errorMsg.innerText = result.error;
      page.append(errorMsg);
    } else {
      updateNav();
      renderHome();
    }
  });
}

function renderRegisterPage() {
  clearContainer();
  //DOM
  const page = document.createElement("div");

  const registerForm = document.createElement("form");
  const labelOne = document.createElement("label");
  const inputUsername = document.createElement("input");
  inputUsername.classList.add("username-input");
  const labelTwo = document.createElement("label");
  const inputEmail = document.createElement("input");
  inputEmail.classList.add("email-input");
  const labelThree = document.createElement("label");
  const inputPassword = document.createElement("input");
  inputPassword.classList.add("password-input");
  const loginBtn = document.createElement("button");
  loginBtn.classList.add("login-btn");
  const text = document.createElement("p");
  const registerBtn = document.createElement("button");

  labelOne.innerText = "Username: ";
  labelTwo.innerText = "Email: ";
  inputEmail.type = "email";
  labelThree.innerText = "Password: ";
  inputPassword.type = "password";
  loginBtn.innerText = "Log In";
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
    renderHome();
  });
}

async function renderHome() {
  clearContainer();

  const books = await getBooks();
  const page = document.createElement("div");

  const token = localStorage.getItem("token");
  const user = token ? await getMe() : null;
  console.log(user);

  books.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const img = document.createElement("img");
    const title = document.createElement("h2");
    const author = document.createElement("p");
    const date = document.createElement("p");
    const pages = document.createElement("p");
    const wishlistBtn = document.createElement("button");

    img.src = "http://localhost:1337" + book.cover.url;
    title.innerText = book.title;
    author.innerText = `by ${book.author}`;
    date.innerText = `Release Date: ${book.release_date} `;
    pages.innerText = `Pages:${book.pages}`;
    wishlistBtn.innerText = "Want to Read";

    checkIfWishlisted(user, book, wishlistBtn);

    card.append(img, title, author, date, pages, wishlistBtn);
    page.append(card);

    wishlistBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await handleWishlistClick(token, book, wishlistBtn);
    });

    card.addEventListener("click", () => {
      renderBookPage(book);
    });
  });
  container.append(page);
}

async function renderBookPage(book) {
  clearContainer();

  const token = localStorage.getItem("token");
  const user = token ? await getMe() : null;

  const page = document.createElement("div");
  const leftSide = document.createElement("div");
  const rightSide = document.createElement("div");

  const backBtn = document.createElement("button");
  const img = document.createElement("img");
  const title = document.createElement("h2");
  const author = document.createElement("p");
  const date = document.createElement("p");
  const pages = document.createElement("p");
  const wishlistBtn = document.createElement("button");

  backBtn.innerText = "Back";
  img.src = "http://localhost:1337" + book.cover.url;
  title.innerText = book.title;
  author.innerText = `by ${book.author}`;
  date.innerText = `Release Date: ${book.release_date} `;
  pages.innerText = `Pages:${book.pages}`;
  wishlistBtn.innerText = "Want to Read";

  checkIfWishlisted(user, book, wishlistBtn);

  leftSide.append(backBtn, title, author, date, pages, wishlistBtn);
  rightSide.append(img);
  page.append(leftSide, rightSide);
  container.append(page);

  backBtn.addEventListener("click", renderHome);
  wishlistBtn.addEventListener("click", async () => {
    await handleWishlistClick(token, book, wishlistBtn);
  });
}

//Page Load
function onPageLoad() {
  updateNav();
  renderHome();
}
onPageLoad();
