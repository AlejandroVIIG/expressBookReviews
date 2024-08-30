const express = require("express");
const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res.status(400).send("Username or password not provided.");

  for (const user of users)
    if (username === user.name)
      return res.status(400).send(`Username ${username} already exists.`);

  users.push({
    username: username,
    password: password,
  });

  return res.status(200).send(`User ${username} successfully registered.`);
});

/*
// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});
*/

// Get the book list available in the shop using promise
public_users.get("/", (req, res) => {
  new Promise((resolve, reject) => {
    resolve(books); // Resolve the promise with the `books` object
  })
    .then(bookList => {
      res.status(200).send(JSON.stringify(bookList, null, 4)); // Send the resolved books
    })
    .catch(error => {
      res.status(500).send("Failed to retrieve books list");
    });
});

/*
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredBook = books[isbn];

  if (!filteredBook) return res.status(404).send("Book not found");

  return res.status(200).send(JSON.stringify(filteredBook, null, 4));
});
*/

public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const filteredBook = books[isbn];

    if (!filteredBook) {
      reject("Book not found"); // Reject the promise if the book is not found
    } else {
      resolve(filteredBook); // Resolve the promise with the found book
    }
  })
    .then(book => {
      res.status(200).send(JSON.stringify(book, null, 4)); // Send the resolved book
    })
    .catch(error => {
      res.status(404).send(error); // Handle the rejected promise
    });
});

/*
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = decodeURIComponent(req.params.author).toLowerCase();
  const filteredBooks = [];

  for (const isbn in books)
    if (books[isbn].author.toLowerCase().includes(author))
      filteredBooks.push(books[isbn]);

  if (filteredBooks.length === 0) return res.status(404).send("No books found");

  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});
*/

public_users.get("/author/:author", function (req, res) {
  const author = decodeURIComponent(req.params.author).toLowerCase();

  new Promise((resolve, reject) => {
    const filteredBooks = [];

    for (const isbn in books) {
      if (books[isbn].author.toLowerCase().includes(author))
        filteredBooks.push(books[isbn]);
    }

    if (filteredBooks.length === 0) reject("No books found");
    else resolve(filteredBooks);
  })
    .then(books => {
      res.status(200).send(JSON.stringify(books, null, 4));
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

/*
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = decodeURIComponent(req.params.title).toLowerCase();
  let filteredBook;

  for (const isbn in books)
    if (books[isbn].title.toLowerCase().includes(title))
      filteredBook = books[isbn];

  if (!filteredBook) return res.status(404).send("No book found");

  return res.status(200).send(JSON.stringify(filteredBook, null, 4));
});
*/

public_users.get("/title/:title", (req, res) => {
  const title = decodeURIComponent(req.params.title).toLowerCase();

  new Promise((resolve, reject) => {
    let filteredBook;

    for (const isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title)) {
        filteredBook = books[isbn];
        break; // Exit the loop once a match is found
      }
    }

    if (filteredBook) {
      resolve(filteredBook);
    } else {
      reject("No book found");
    }
  })
    .then(book => {
      res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredBook = books[isbn];

  if (!filteredBook) return res.status(404).send("Book not found");

  if (Object.keys(filteredBook.reviews).length === 0)
    return res.status(404).send("Book has no review");

  return res.status(200).send(JSON.stringify(filteredBook.reviews, null, 4));
});

module.exports.general = public_users;
