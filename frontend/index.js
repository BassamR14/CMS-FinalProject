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
  uploadImage,
  createBook,
  deleteBook,
  updateBook,
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
  document.body.style.overflow = "";
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

      adminBtn.addEventListener("click", renderAdmin);
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

function chooseBackground(element) {
  if (document.body.classList.contains("modern")) {
    element.style.backgroundImage = "url('./images/modern.png')";
  } else if (document.body.classList.contains("retro")) {
    element.style.backgroundImage = "url('./images/retro.png')";
  } else if (document.body.classList.contains("vaporwave")) {
    element.style.backgroundImage = "url('./images/vaporwave.png')";
  }
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center";
  document.body.style.overflow = "hidden";
}

//Render Functions
function renderLoginPage() {
  clearContainer();
  //DOM
  const page = document.createElement("div");
  page.classList.add("login-page");

  chooseBackground(page);

  const loginForm = document.createElement("form");
  loginForm.classList.add("login-form");
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
  text.style.textAlign = "center";
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
      loginForm.append(errorMsg);
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
  page.classList.add("login-page");

  chooseBackground(page);

  const registerForm = document.createElement("form");
  registerForm.classList.add("login-form");
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
  loginBtn.innerText = "Log In Here";
  loginBtn.type = "button";
  text.innerText = "If you have an account, ";
  text.style.textAlign = "center";
  registerBtn.innerText = "Register";
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
    const result = await register(username, email, password);
    if (result.error) {
      const errorMsg = document.createElement("p");
      errorMsg.innerText = result.error;
      registerForm.append(errorMsg);
    } else {
      updateNav();
      renderHome();
    }
  });
}

async function renderHome() {
  clearContainer();

  const token = localStorage.getItem("token");
  const user = token ? await getMe() : null;
  const books = await getBooks();
  console.log(books, user);

  //DOM
  const page = document.createElement("div");
  page.classList.add("home-page");
  const hero = document.createElement("img");
  hero.classList.add("hero");
  const booksContainer = document.createElement("div");
  booksContainer.classList.add("books-container");
  const categories = document.createElement("div");
  categories.classList.add("categories");
  const booksDisplay = document.createElement("div");
  booksDisplay.classList.add("book-display");

  //Hero
  const body = document.body;
  if (body.classList.contains("modern")) {
    hero.src = "./images/modern-banner.png";
  } else if (body.classList.contains("retro")) {
    hero.src = "./images/retro-banner.png";
  } else if (body.classList.contains("vaporwave")) {
    hero.src = "./images/vaporwave-banner.png";
  }

  //Category Filter DOM
  const category = document.createElement("h2");
  category.innerText = "Category";
  const novelBtn = document.createElement("button");
  novelBtn.innerText = "Novels";
  const educationalBtn = document.createElement("button");
  educationalBtn.innerText = "Educational";
  const comicBtn = document.createElement("button");
  comicBtn.innerText = "Comic Books";

  categories.append(category, novelBtn, educationalBtn, comicBtn);

  function renderBooks(list) {
    booksDisplay.querySelectorAll(".card").forEach((c) => c.remove());
    booksDisplay.querySelectorAll("p").forEach((p) => p.remove());

    list.forEach((book) => {
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
      pages.innerText = `Pages: ${book.pages}`;
      rating.innerText = book.ratings.length
        ? `${average}/5 ⭐`
        : "no rating yet";
      wishlistBtn.innerText = "Add to Reading List";

      checkIfWishlisted(user, book, wishlistBtn);

      card.append(img, title, author, date, pages, rating, wishlistBtn);
      booksDisplay.append(card);

      wishlistBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        wishlistBtn.disabled = true;
        await handleWishlistClick(token, book, wishlistBtn);
      });

      card.addEventListener("click", () => {
        renderBookPage(book);
      });
    });

    if (list.length === 0) {
      const message = document.createElement("p");
      message.innerText = "No Books Found";
      booksDisplay.append(message);
    }
  }

  renderBooks(books);

  //Search
  const searchBar = document.querySelector("#search-bar");
  searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const searchInput = searchBar.value.trim();

      if (searchInput === "" || !searchInput) {
        alert("Searh was empty");
        return;
      }

      const filtered = books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchInput) ||
          b.author.toLowerCase().includes(searchInput),
      );

      renderBooks(filtered);
    }
  });

  searchBar.addEventListener("search", () => {
    if (!searchBar.value) {
      renderBooks(books);
    }
  });

  //Category Filter Event Listeners
  novelBtn.addEventListener("click", () => {
    const isActive = novelBtn.classList.contains("active");
    novelBtn.classList.toggle("active");
    educationalBtn.classList.remove("active");
    comicBtn.classList.remove("active");
    renderBooks(isActive ? books : books.filter((b) => b.category === "novel"));
  });

  educationalBtn.addEventListener("click", () => {
    const isActive = educationalBtn.classList.contains("active");
    educationalBtn.classList.toggle("active");
    novelBtn.classList.remove("active");
    comicBtn.classList.remove("active");
    renderBooks(
      isActive ? books : books.filter((b) => b.category === "educational"),
    );
  });

  comicBtn.addEventListener("click", () => {
    const isActive = comicBtn.classList.contains("active");
    comicBtn.classList.toggle("active");
    educationalBtn.classList.remove("active");
    novelBtn.classList.remove("active");
    renderBooks(
      isActive ? books : books.filter((b) => b.category === "comic-book"),
    );
  });

  booksContainer.append(categories, booksDisplay);
  page.append(hero, booksContainer);
  container.append(page);
}

async function renderBookPage(book) {
  clearContainer();

  const token = localStorage.getItem("token");
  const user = token ? await getMe() : null;

  //DOM
  const page = document.createElement("div");
  page.classList.add("book-page-wrapper");

  const bookInfo = document.createElement("div");
  bookInfo.classList.add("book-page");
  const leftSide = document.createElement("div");
  const rightSide = document.createElement("div");

  leftSide.classList.add("book-page-left");
  rightSide.classList.add("book-page-right");

  const backBtn = document.createElement("button");
  const img = document.createElement("img");
  const title = document.createElement("h2");
  const author = document.createElement("p");
  const artist = document.createElement("p");
  const date = document.createElement("p");
  const pages = document.createElement("p");
  const wishlistBtn = document.createElement("button");
  const divider = document.createElement("hr");
  const communityRatingLabel = document.createElement("p");
  const rating = document.createElement("input");

  const average =
    book.ratings.reduce((sum, r) => sum + r.value, 0) / book.ratings.length;

  // Personal rating section
  const ratingSection = document.createElement("div");
  ratingSection.classList.add("rating-section");
  const ratingInput = document.createElement("input");
  const ratingValue = document.createElement("p");
  const saveRating = document.createElement("button");
  const rateThisBookBtn = document.createElement("button");

  rating.type = "range";
  rating.min = "0.5";
  rating.step = "0.5";
  rating.max = "5";
  rating.classList.add("star-rating");
  rating.disabled = true;

  backBtn.classList.add("back-btn");
  backBtn.innerText = "Back";
  img.src = "http://localhost:1337" + book.cover.url;
  title.innerText = book.title;
  author.innerText = `by ${book.author}`;
  date.innerText = `Release Date: ${book.release_date}`;
  pages.innerText = `Pages: ${book.pages}`;

  if (book.artist) {
    artist.innerText = `Art by: ${book.artist}`;
  }

  communityRatingLabel.innerText = book.ratings.length
    ? `Community rating: ${average}/5`
    : "No ratings yet";
  rating.value = book.ratings.length ? average : "0";
  rating.style.setProperty("--val", (book.ratings.length ? average : 0) / 5);

  wishlistBtn.innerText = "Add to Reading List";
  checkIfWishlisted(user, book, wishlistBtn);

  if (token) {
    ratingInput.type = "range";
    ratingInput.min = "0.5";
    ratingInput.step = "0.5";
    ratingInput.max = "5";
    ratingInput.classList.add("star-rating");

    // set initial value to existing rating if user has rated
    const existingRating = user.ratings.find(
      (r) => r.book.documentId === book.documentId,
    );
    saveRating.innerText = existingRating ? "Update Rating" : "Save Rating";

    ratingInput.value = existingRating ? existingRating.value : "2.5";
    ratingValue.innerText = existingRating
      ? `Your rating: ${ratingInput.value}/5`
      : "Rate This Book";
    ratingInput.style.setProperty("--val", ratingInput.value / 5);

    ratingInput.addEventListener("input", () => {
      ratingInput.style.setProperty("--val", ratingInput.value / 5);
      ratingValue.innerText = `Your rating: ${ratingInput.value}/5`;
    });

    ratingSection.append(ratingValue, ratingInput, saveRating);
  } else {
    rateThisBookBtn.innerText = "Log in to rate this book";
    rateThisBookBtn.addEventListener("click", renderLoginPage);
    ratingSection.append(rateThisBookBtn);
  }

  leftSide.append(title, author);

  if (book.artist) {
    leftSide.append(artist);
  }

  leftSide.append(
    date,
    pages,
    communityRatingLabel,
    rating,
    wishlistBtn,
    divider,
    ratingSection,
  );
  rightSide.append(img);
  bookInfo.append(leftSide, rightSide);
  page.append(backBtn, bookInfo);
  container.append(page);

  //Functionality
  backBtn.addEventListener("click", renderHome);

  wishlistBtn.addEventListener("click", async () => {
    wishlistBtn.disabled = true;
    await handleWishlistClick(token, book, wishlistBtn);
  });

  saveRating.addEventListener("click", async () => {
    const updatedUser = await getMe();
    const existingRating = updatedUser.ratings.find(
      (r) => r.book.documentId === book.documentId,
    );

    const res = existingRating
      ? await updateRating(existingRating.documentId, ratingInput.value)
      : await rateBook(book.documentId, user, ratingInput.value);

    if (res) {
      const freshBook = await getBook(book.documentId);
      await renderBookPage(freshBook);
    }
  });
}

async function renderProfile() {
  clearContainer();

  const token = localStorage.getItem("token");
  const user = token ? await getMe() : null;
  const userReadingList = user.to_read;
  const userRatedBooks = user.ratings;

  const page = document.createElement("div");
  page.classList.add("profile-page");
  // const name = document.createElement("h2");
  // const email = document.createElement("p");
  const toRead = document.createElement("h2");
  const ratedBooks = document.createElement("h2");

  // name.innerText = user.username;
  // email.innerText = user.email;
  toRead.innerText = "Reading List";
  ratedBooks.innerText = "Rated Books";

  const toReadContainer = document.createElement("div");
  toReadContainer.classList.add("list");
  const sortContainer = document.createElement("div");
  sortContainer.classList.add("sort-container");
  const sortText = document.createElement("p");
  const sortByAuthorBtn = document.createElement("button");
  const sortByTitleBtn = document.createElement("button");

  sortText.innerText = "Sort by:";
  sortByAuthorBtn.innerText = "Author";
  sortByTitleBtn.innerText = "Title";

  const ratedBooksContainer = document.createElement("div");
  ratedBooksContainer.classList.add("list");
  const ratedSortContainer = document.createElement("div");
  ratedSortContainer.classList.add("sort-container");
  const sortRatedText = document.createElement("p");
  const sortRatedByAuthorBtn = document.createElement("button");
  const sortRatedByTitleBtn = document.createElement("button");
  const sortRatedByRatingBtn = document.createElement("button");

  sortRatedText.innerText = "Sort by:";
  sortRatedByAuthorBtn.innerText = "Author";
  sortRatedByTitleBtn.innerText = "Title";
  sortRatedByRatingBtn.innerText = "Rating";

  sortContainer.append(sortText, sortByAuthorBtn, sortByTitleBtn);
  toReadContainer.append(toRead, sortContainer);
  ratedSortContainer.append(
    sortRatedText,
    sortRatedByAuthorBtn,
    sortRatedByTitleBtn,
    sortRatedByRatingBtn,
  );
  ratedBooksContainer.append(ratedBooks, ratedSortContainer);
  page.append(toReadContainer, ratedBooksContainer);
  container.append(page);

  function renderReadingList(list) {
    toReadContainer.querySelectorAll(".card").forEach((c) => c.remove());

    list.forEach((book) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("profile");

      const img = document.createElement("img");
      const info = document.createElement("div");
      info.classList.add("info");
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

      info.append(title, author, date, pages, removeBtn);
      card.append(info, img);
      toReadContainer.append(card);

      removeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await removeBook(book.documentId);
        renderProfile();
      });

      card.addEventListener("click", async () => {
        const freshBook = await getBook(book.documentId);
        renderBookPage(freshBook);
      });
    });
  }

  renderReadingList(userReadingList);

  sortByAuthorBtn.addEventListener("click", () => {
    const isActive = sortByAuthorBtn.classList.contains("active");
    sortByAuthorBtn.classList.toggle("active");
    sortByTitleBtn.classList.remove("active");
    renderReadingList(
      isActive
        ? userReadingList
        : userReadingList.toSorted((a, b) => a.author.localeCompare(b.author)),
    );
  });

  sortByTitleBtn.addEventListener("click", () => {
    const isActive = sortByTitleBtn.classList.contains("active");
    sortByTitleBtn.classList.toggle("active");
    sortByAuthorBtn.classList.remove("active");
    renderReadingList(
      isActive
        ? userReadingList
        : userReadingList.toSorted((a, b) => a.title.localeCompare(b.title)),
    );
  });

  function renderRatedList(list) {
    ratedBooksContainer.querySelectorAll(".card").forEach((c) => c.remove());

    list.forEach((book) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("profile");
      const img = document.createElement("img");
      const info = document.createElement("div");
      info.classList.add("info");
      const title = document.createElement("h2");
      const author = document.createElement("p");
      const rating = document.createElement("p");

      img.src = "http://localhost:1337" + book.book.cover?.url;
      title.innerText = book.book.title;
      author.innerText = `by ${book.book.author}`;
      rating.innerText = `My rating: ${book.value}/5 ⭐`;

      info.append(title, author, rating);
      card.append(info, img);
      ratedBooksContainer.append(card);

      card.addEventListener("click", async () => {
        const freshBook = await getBook(book.book.documentId);
        renderBookPage(freshBook);
      });
    });
  }

  renderRatedList(userRatedBooks);

  sortRatedByAuthorBtn.addEventListener("click", () => {
    const isActive = sortRatedByAuthorBtn.classList.contains("active");
    sortRatedByAuthorBtn.classList.toggle("active");
    sortRatedByTitleBtn.classList.remove("active");
    sortRatedByRatingBtn.classList.remove("active");
    renderRatedList(
      isActive
        ? userRatedBooks
        : userRatedBooks.toSorted((a, b) =>
            a.book.author.localeCompare(b.book.author),
          ),
    );
  });

  sortRatedByTitleBtn.addEventListener("click", () => {
    const isActive = sortRatedByTitleBtn.classList.contains("active");
    sortRatedByTitleBtn.classList.toggle("active");
    sortRatedByAuthorBtn.classList.remove("active");
    sortRatedByRatingBtn.classList.remove("active");
    renderRatedList(
      isActive
        ? userRatedBooks
        : userRatedBooks.toSorted((a, b) =>
            a.book.title.localeCompare(b.book.title),
          ),
    );
  });

  sortRatedByRatingBtn.addEventListener("click", () => {
    const isActive = sortRatedByRatingBtn.classList.contains("active");
    sortRatedByRatingBtn.classList.toggle("active");
    sortRatedByAuthorBtn.classList.remove("active");
    sortRatedByTitleBtn.classList.remove("active");
    renderRatedList(
      isActive
        ? userRatedBooks
        : userRatedBooks.toSorted((a, b) => b.value - a.value),
    );
  });
}

async function renderAdmin() {
  clearContainer();

  let editingBookId = null;

  const page = document.createElement("div");
  page.classList.add("admin-page");
  const pageTitle = document.createElement("h2");
  pageTitle.innerText = "Admin Dashboard";
  const pagecontainer = document.createElement("div");
  pagecontainer.classList.add("admin-container");
  const form = document.createElement("form");
  form.classList.add("add-book-form");
  const table = document.createElement("table");

  const tableHeader = document.createElement("tr");
  const bookCover = document.createElement("th");
  const bookName = document.createElement("th");
  const bookAuthor = document.createElement("th");
  const bookDate = document.createElement("th");
  const bookPages = document.createElement("th");
  const bookRating = document.createElement("th");
  const bookActions = document.createElement("th");

  bookCover.innerText = "Cover";
  bookName.innerText = "Title";
  bookAuthor.innerText = "Author";
  bookDate.innerText = "Release Date";
  bookPages.innerText = "Pages";
  bookRating.innerText = "Rating";
  bookActions.innerText = "Actions";

  tableHeader.append(
    bookCover,
    bookName,
    bookAuthor,
    bookDate,
    bookPages,
    bookRating,
    bookActions,
  );
  table.append(tableHeader);

  const formTitle = document.createElement("h3");
  formTitle.innerText = "Add Book";

  const labelTitle = document.createElement("label");
  const title = document.createElement("input");
  title.classList.add("title-input");
  labelTitle.innerText = "Title: ";
  labelTitle.append(title);

  const labelAuthor = document.createElement("label");
  const author = document.createElement("input");
  author.classList.add("author-input");
  labelAuthor.innerText = "Author: ";
  labelAuthor.append(author);

  const labelPages = document.createElement("label");
  const pages = document.createElement("input");
  pages.classList.add("pages-input");
  pages.type = "number";
  labelPages.innerText = "Pages: ";
  labelPages.append(pages);

  const categories = ["novel", "educational", "comic-book"];
  const labelCategory = document.createElement("label");
  const category = document.createElement("select");
  category.classList.add("category-select");
  labelCategory.innerText = "Category:";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerText = cat;
    category.append(option);
  });

  labelCategory.append(category);

  const labelDate = document.createElement("label");
  const date = document.createElement("input");
  date.classList.add("date-input");
  date.type = "date";
  labelDate.innerText = "Release Date: ";
  labelDate.append(date);

  const labelImg = document.createElement("label");
  const img = document.createElement("input");
  img.type = "file";
  labelImg.innerText = "Cover Image: ";
  labelImg.append(img);

  const addBookBtn = document.createElement("button");
  addBookBtn.innerText = "Add Book";
  addBookBtn.type = "button";

  form.append(
    formTitle,
    labelTitle,
    labelAuthor,
    labelPages,
    labelCategory,
    labelDate,
    labelImg,
    addBookBtn,
  );
  pagecontainer.append(form, table);
  page.append(pageTitle, pagecontainer);
  container.append(page);

  //Functionality

  function clearForm() {
    title.value = "";
    author.value = "";
    pages.value = "";
    category.value = "novel";
    date.value = "";
    img.value = "";
  }

  addBookBtn.addEventListener("click", async () => {
    if (!title.value || !author.value || !pages.value || !date.value) {
      alert("Please fill in all fields");
      return;
    }

    if (editingBookId) {
      const updatedBook = {
        title: title.value,
        author: author.value,
        pages: pages.value,
        category: category.value,
        release_date: date.value,
      };
      await updateBook(editingBookId, updatedBook);
      editingBookId = null;
      addBookBtn.innerText = "Add Book";
      clearForm();
    } else {
      if (!img.files[0]) {
        alert("Please fill in all fields");
        return;
      }

      const image = img.files;
      let imgData = new FormData();
      imgData.append("files", image[0]);

      const uploadedImage = await uploadImage(imgData);

      const newBook = {
        title: title.value,
        author: author.value,
        pages: pages.value,
        category: category.value,
        release_date: date.value,
        cover: uploadedImage[0].id,
      };

      await createBook(newBook);
      clearForm();
    }

    const freshBooks = await getBooks();
    renderTable(freshBooks);
  });

  function renderTable(list) {
    table.querySelectorAll("tr:not(:first-child)").forEach((r) => r.remove());

    list.forEach((book) => {
      const tr = document.createElement("tr");
      const imgCell = document.createElement("td");
      const img = document.createElement("img");
      const title = document.createElement("td");
      const author = document.createElement("td");
      const date = document.createElement("td");
      const pages = document.createElement("td");
      const rating = document.createElement("td");
      const actions = document.createElement("td");
      const editBtn = document.createElement("button");
      const deleteBtn = document.createElement("button");

      const average =
        book.ratings.reduce((sum, r) => sum + r.value, 0) / book.ratings.length;

      img.src = "http://localhost:1337" + book.cover.url;
      title.innerText = book.title;
      author.innerText = `${book.author}`;
      date.innerText = `${book.release_date} `;
      pages.innerText = `${book.pages}`;
      rating.innerText = book.ratings.length
        ? `${average}/5 ⭐`
        : "no rating yet";
      editBtn.innerText = "Edit";
      deleteBtn.innerText = "Delete";

      actions.append(editBtn, deleteBtn);
      imgCell.append(img);
      tr.append(imgCell, title, author, date, pages, rating, actions);
      table.append(tr);

      //functionality

      deleteBtn.addEventListener("click", async () => {
        await deleteBook(book.documentId);
        const freshBooks = await getBooks();
        renderTable(freshBooks);
      });

      editBtn.addEventListener("click", () => {
        editingBookId = book.documentId;

        document.querySelector(".title-input").value = book.title;
        document.querySelector(".author-input").value = book.author;
        document.querySelector(".pages-input").value = book.pages;
        document.querySelector(".category-select").value = book.category;
        document.querySelector(".date-input").value = book.release_date;

        addBookBtn.innerText = "Update Book";
      });
    });
  }

  const books = await getBooks();
  renderTable(books);
}

//Page Load
function onPageLoad() {
  applyTheme();
  updateNav();
  renderHome();
}
onPageLoad();
