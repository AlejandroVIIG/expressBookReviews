const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = username => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.

  // Return true if any user matches the provided username and password, otherwise false
  return users.some(
    user => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
    return res.status(400).json({ message: "Error logging in" });

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = {
      accessToken,
      username,
    };

    return res
      .status(200)
      .json({ token: accessToken, message: "Login successful" });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!username) return res.status(403).send("User not logged in.");

  if (!review) return res.status(400).send("No review provided.");

  const book = books[isbn];

  if (!book) return res.status(404).send("Book not found.");

  if (!book.reviews) book.reviews = {};

  book.reviews[username] = review;

  return res.status(200)
    .send(`Review for ${book.title} by ${username} successfully updated.
                Review: ${review}`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;

  if (!username) return res.status(403).send("User not logged in");

  const book = books[isbn];

  if (!book) return res.status(404).send("Book not found");

  if (!book.reviews)
    return res.status(404).send(`No reviews found for this book`);

  if (!book.reviews[username])
    return res.status(404).send("No review found for this user");

  // Delete the review
  delete book.reviews[username];

  return res
    .status(200)
    .send(`Review for ${book.title} by ${username} successfully deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
