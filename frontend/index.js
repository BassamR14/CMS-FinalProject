import {
  register,
  login,
  logout,
  getMe,
  getBooks,
  getBook,
  saveBook,
  removeBook,
  getSettings,
  rateBook,
  updateRating,
} from "./api.js";

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
      profileBtn.innerText = `${user.username}'s Profile`;
      nav.prepend(profileBtn);

      profileBtn.addEventListener("click", renderProfile);
    }
  } else {
    navLogin.innerText = "Log In";
    navLogin.removeEventListener("click", handleLogout);
    navLogin.addEventListener("click", renderLoginPage);
  }
}

function checkIfWishlisted(user, book, wishlistBtn) {
  if (user && user.to_read.some((b) => b.documentId === book.documentId)) {
    wishlistBtn.innerText = ` ✓On Reading List`;
    wishlistBtn.disabled = true;
  }
}

async function handleWishlistClick(token, book, wishlistBtn) {
  if (token) {
    await saveBook(book.documentId);
    wishlistBtn.innerText = `✓ On Reading List`;
    wishlistBtn.disabled = true;
  } else {
    renderLoginPage();
  }
}

async function applyTheme() {
  const settings = await getSettings();
  document.body.className = settings.theme;
}

function checkIfRated(user, book, rateButton) {
  if (user && user.ratings.some((r) => r.book.documentId === book.documentId)) {
    rateButton.innerText = ` Change Rating`;
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
  console.log(books, user);

  books.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const img = document.createElement("img");
    const title = document.createElement("h2");
    const author = document.createElement("p");
    const date = document.createElement("p");
    const pages = document.createElement("p");
    const rating = document.createElement("p");
    const wishlistBtn = document.createElement("button");

    const average =
      book.ratings.reduce((sum, r) => sum + r.value, 0) / book.ratings.length;

    img.src = "http://localhost:1337" + book.cover.url;
    title.innerText = book.title;
    author.innerText = `by ${book.author}`;
    date.innerText = `Release Date: ${book.release_date} `;
    pages.innerText = `Pages:${book.pages}`;
    rating.innerText = book.ratings.length ? `${average}/5` : "No ratings yet";
    wishlistBtn.innerText = "Want to Read";

    checkIfWishlisted(user, book, wishlistBtn);

    card.append(img, title, author, date, pages, rating, wishlistBtn);
    page.append(card);

    wishlistBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      wishlistBtn.disabled = true;
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

  //DOM

  const page = document.createElement("div");
  page.classList.add("book-page");
  const leftSide = document.createElement("div");
  const rightSide = document.createElement("div");
  const ratingSection = document.createElement("div");

  const backBtn = document.createElement("button");
  const img = document.createElement("img");
  const title = document.createElement("h2");
  const author = document.createElement("p");
  const date = document.createElement("p");
  const pages = document.createElement("p");
  const rating = document.createElement("p");
  const wishlistBtn = document.createElement("button");
  const rateThisBookBtn = document.createElement("button");

  const average =
    book.ratings.reduce((sum, r) => sum + r.value, 0) / book.ratings.length;

  backBtn.innerText = "Back";
  img.src = "http://localhost:1337" + book.cover.url;
  title.innerText = book.title;
  author.innerText = `by ${book.author}`;
  date.innerText = `Release Date: ${book.release_date} `;
  pages.innerText = `Pages:${book.pages}`;
  rating.innerText = book.ratings.length ? `${average}/5` : "No ratings yet";
  wishlistBtn.innerText = "Want to Read";
  rateThisBookBtn.innerText = "Rate This Book";

  checkIfWishlisted(user, book, wishlistBtn);
  checkIfRated(user, book, rateThisBookBtn);

  ratingSection.append(rateThisBookBtn);
  leftSide.append(
    backBtn,
    title,
    author,
    date,
    pages,
    rating,
    wishlistBtn,
    ratingSection,
  );
  rightSide.append(img);
  page.append(leftSide, rightSide);
  container.append(page);

  //Functionality

  backBtn.addEventListener("click", renderHome);

  wishlistBtn.addEventListener("click", async () => {
    wishlistBtn.disabled = true;
    await handleWishlistClick(token, book, wishlistBtn);
  });

  rateThisBookBtn.addEventListener("click", renderRatingSection);

  function renderRatingSection() {
    ratingSection.innerHTML = "";

    const label = document.createElement("label");
    const select = document.createElement("select");
    const saveRating = document.createElement("button");
    const availableRatings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    availableRatings.forEach((rating) => {
      const option = document.createElement("option");
      option.value = rating;
      option.innerText = rating;
      select.append(option);
    });

    label.innerText = "/5";
    saveRating.innerText = "Save Rating";

    label.prepend(select);
    ratingSection.append(label, saveRating);

    saveRating.addEventListener("click", async () => {
      const updatedUser = await getMe();
      const existingRating = updatedUser.ratings.find(
        (r) => r.book.documentId === book.documentId,
      );

      const res = existingRating
        ? await updateRating(existingRating.documentId, select.value)
        : await rateBook(book.documentId, user, select.value);

      if (res) {
        const freshBook = await getBook(book.documentId);
        await renderBookPage(freshBook);
      }
    });
  }
}

async function renderProfile() {
  clearContainer();

  const token = localStorage.getItem("token");
  const user = token ? await getMe() : null;
  const userReadingList = user.to_read;

  const page = document.createElement("div");
  const name = document.createElement("h2");
  const email = document.createElement("p");
  const toRead = document.createElement("h2");

  name.innerText = user.username;
  email.innerText = user.email;
  toRead.innerText = "Reading List";

  const toReadContainer = document.createElement("div");
  const sortContainer = document.createElement("div");
  const sortText = document.createElement("p");
  const sortByAuthorBtn = document.createElement("button");
  const sortByTitleBtn = document.createElement("button");

  sortText.innerText = "Sort by:";
  sortByAuthorBtn.innerText = "Author";
  sortByTitleBtn.innerText = "Title";

  sortContainer.append(sortText, sortByAuthorBtn, sortByTitleBtn);
  toReadContainer.append(sortContainer);
  page.append(name, email, toRead, toReadContainer);
  container.append(page);

  function renderCards(list) {
    toReadContainer.querySelectorAll(".card").forEach((c) => c.remove());

    list.forEach((book) => {
      const card = document.createElement("div");
      card.classList.add("card");
      const img = document.createElement("img");
      const title = document.createElement("h2");
      const author = document.createElement("p");
      const date = document.createElement("p");
      const pages = document.createElement("p");
      const removeBtn = document.createElement("button");

      img.src = "http://localhost:1337" + book.cover?.url;
      title.innerText = book.title;
      author.innerText = `by ${book.author}`;
      date.innerText = `Release Date: ${book.release_date}`;
      pages.innerText = `Pages: ${book.pages}`;
      removeBtn.innerText = "Remove";

      card.append(img, title, author, date, pages, removeBtn);
      toReadContainer.append(card);

      removeBtn.addEventListener("click", async () => {
        await removeBook(book.documentId);
        renderProfile();
      });
    });
  }

  renderCards(userReadingList);

  sortByAuthorBtn.addEventListener("click", () => {
    const isActive = sortByAuthorBtn.classList.contains("active");
    sortByAuthorBtn.classList.toggle("active");
    sortByTitleBtn.classList.remove("active");
    renderCards(
      isActive
        ? userReadingList
        : userReadingList.toSorted((a, b) => a.author.localeCompare(b.author)),
    );
  });

  sortByTitleBtn.addEventListener("click", () => {
    const isActive = sortByTitleBtn.classList.contains("active");
    sortByTitleBtn.classList.toggle("active");
    sortByAuthorBtn.classList.remove("active");
    renderCards(
      isActive
        ? userReadingList
        : userReadingList.toSorted((a, b) => a.title.localeCompare(b.title)),
    );
  });
}

//Page Load
function onPageLoad() {
  applyTheme();
  updateNav();
  renderHome();
}
onPageLoad();
