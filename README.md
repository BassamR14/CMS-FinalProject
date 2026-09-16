# 📚 Books R Us

**Books R Us** is a full-stack book application built for a fictional book store. The application allows visitors to browse and search for books, create an account, log in, save books to a personal **"To Read"** list, and rate books.

The project includes both a **frontend application** and a **Strapi backend/CMS**, with authentication and different permissions for regular users and administrators.

## 📖 About the Project

The application was developed as an individual project with the goal of creating a professional book store platform with both user-facing and administrative functionality.

Books are managed through **Strapi CMS**, while the frontend communicates with the backend API to retrieve and manage data.

The application has different user experiences depending on the user's role:

* **Logged-out users** can browse, search, and filter books, as well as register and log in.
* **Logged-in users** can save and rate books, manage their profile, and view their personal book lists.
* **Admin users** have access to an admin panel where they can upload new books.
* **Super Admins** can manage the book content and choose the website's active theme through Strapi.

## ✨ Features

### 📚 Book Catalogue

Users can browse all books available through the API.

Each book contains:

* Title
* Author
* Number of pages
* Publication date
* Cover image
* Average rating

The average rating is calculated from ratings submitted by users.

### 🔎 Search

The application includes a search function that allows users to quickly find books based on their search query.

This makes it easier to navigate the book catalogue as the number of available books grows.

### 🏷️ Categories

Books can be organized into three different categories:

* 📖 Novels
* 🎓 Educational Books
* 💥 Comic Books

Users can use the category selector to filter the book catalogue and find books belonging to a specific category.

### 🔐 Authentication

Users can:

* Register an account
* Log in
* Log out
* See which user is currently logged in

Authentication and user management are handled through the Strapi backend.

### 📖 To Read List

Logged-in users can save books to their personal **"To Read"** list.

On their profile page, users can:

* View all saved books
* Sort books by title
* Sort books by author
* Remove books from their list

### ⭐ Book Ratings

Logged-in users can rate books on a **1–10 scale**.

The application also displays the book's average rating based on ratings submitted by users.

The profile page includes a separate list of books the user has rated.

Rated books can be sorted by:

* Title (A–Ö)
* Author (A–Ö)
* Rating (highest to lowest)

### 👤 Profile Page

Each logged-in user has a personal profile page where they can manage and view their book activity.

The profile contains:

* Personal "To Read" list
* Rated books
* Sorting functionality
* Ability to remove saved books

### 🛠️ Admin Panel

Admin users have access to an admin panel directly within the website.

Admins can upload new books without having to access the Strapi admin interface.

The project also supports a **Super Admin** role through Strapi, which can manage the book content and website themes.

### 🎨 Themes

The website supports **three different visual themes**.

The active theme is controlled by the Super Admin through Strapi.

Regular users cannot change the theme themselves.

## 🏗️ Project Structure

The project is divided into two main parts:

```text
Books-R-Us/
│
├── frontend/
│   └── ...
│
└── backend/
    └── ...
```

### Frontend

The frontend contains the user interface and application logic.

It communicates with the Strapi API to:

* Fetch books
* Search and filter books
* Authenticate users
* Save books
* Submit ratings
* Retrieve user data
* Manage admin functionality
* Retrieve the selected website theme

### Backend

The backend is built with **Strapi** and acts as the CMS and API.

It handles:

* Book management
* User authentication
* User roles and permissions
* Saved books
* Ratings
* Average ratings
* Book categories
* Website themes

The Strapi admin interface can be used by administrators to create and manage book content.

## 🛠️ Technologies

* HTML
* CSS
* JavaScript
* Strapi
* REST API
* Authentication
* CMS
* CRUD operations
* Asynchronous JavaScript
* DOM manipulation

## 🚀 Local Setup

### Requirements

Make sure you have the following installed:

* Git
* Node.js 20–24
* npm

### 1. Clone the repository

### 2. Set up the Strapi backend

Navigate to the backend folder and install the dependencies:

```bash
cd backend
npm install
```

The repository contains an `.env.example` file, but the actual `.env` file is not included because it contains secret values.

Create the `.env` file:

```bash
cp .env.example .env
```

Generate the required Strapi secrets:

```bash
node -e "const c=require('crypto'); console.log('APP_KEYS=\"'+c.randomBytes(32).toString('base64')+','+c.randomBytes(32).toString('base64')+'\"'); console.log('API_TOKEN_SALT='+c.randomBytes(32).toString('base64')); console.log('ADMIN_JWT_SECRET='+c.randomBytes(32).toString('base64')); console.log('TRANSFER_TOKEN_SALT='+c.randomBytes(32).toString('base64')); console.log('JWT_SECRET='+c.randomBytes(32).toString('base64')); console.log('ENCRYPTION_KEY='+c.randomBytes(32).toString('base64'))"
```

Copy the generated values into `backend/.env` alongside the existing configuration.

Start Strapi:

```bash
npm run develop
```

Strapi will be available at:

```text
http://localhost:1337
```

The Strapi administration panel is available at:

```text
http://localhost:1337/admin
```

### 3. Existing CMS data

The project includes the existing Strapi SQLite database:

```text
backend/.tmp/data.db
```

The `.tmp` directory is intentionally included in the repository, so the existing CMS data is already available after cloning.

No separate database installation or database import is required.

### 4. Set the Strapi admin password

The included database contains an administrator account with the email:

```text
boss@test.com
```

Since the password is not stored in the repository, set a new local password after cloning the project.

First, stop Strapi with:

```text
Ctrl + C
```

Then, from the `backend` directory, run:

```bash
npm run strapi admin:reset-user-password -- --email=boss@test.com --password="YourNewPassword123!"
```

Replace the password with one of your choice.

Start Strapi again:

```bash
npm run develop
```

You can now log in to the Strapi admin panel at:

```text
http://localhost:1337/admin
```

using:

```text
Email: boss@test.com
Password: the password you chose
```

### 5. Start the frontend

Open the `frontend` folder in VS Code.

Open:

```text
frontend/index.html
```

with **Live Server**.

The website will then communicate with the locally running Strapi backend.

> **Important:** The Strapi backend must be running for the website's API-dependent features to work.

## 🎯 Project Requirements

The project covers the required functionality for:

* User registration and authentication
* Book catalogue
* Strapi CMS integration
* Book creation and management
* User roles
* Admin functionality
* Saved books
* Personal profiles
* Book ratings
* Average ratings
* Search functionality
* Category filtering
* Sorting functionality
* Multiple website themes
* Professional UI

## 📚 What I Practiced

This project gave me experience working with a more complete application architecture and helped me practice:

* Building a frontend that communicates with a REST API
* Working with Strapi as a headless CMS
* User authentication
* User roles and permissions
* CRUD operations
* Managing relationships between users and books
* Implementing rating systems
* Calculating average ratings
* Managing user-specific data
* Searching and filtering data
* Sorting data
* Creating admin functionality
* Working with asynchronous JavaScript
* Structuring a project with separate frontend and backend applications
* Creating a professional and responsive user interface

## 🔮 Future Improvements

Some features I would like to explore in the future:

* Pagination for larger book collections
* More detailed book pages
* Book reviews and comments
* User avatars
* Improved error and loading states
* More advanced admin functionality
* Responsive improvements for smaller screens

---

**Books R Us 📚 — A full-stack book store experience built with a custom frontend and Strapi CMS.**
