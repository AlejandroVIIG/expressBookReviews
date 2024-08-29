const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredBook = books[isbn];

  if(!filteredBook) return res.status(404).send('Book not found');

  return res.status(200).send(JSON.stringify(filteredBook, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = decodeURIComponent(req.params.author).toLowerCase();
  const filteredBooks = [];

  for(const isbn in books) {
    if(books[isbn].author.toLowerCase().includes(author))
        filteredBooks.push(books[isbn]);
  }

  if (filteredBooks.length === 0) return res.status(404).send('No books found');

  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = decodeURIComponent(req.params.title).toLowerCase();
  let filteredBook;

  for(const isbn in books) {
    if(books[isbn].title.toLowerCase().includes(title))
        filteredBook = books[isbn];
  }

  if (!filteredBook) return res.status(404).send('No book found');

  return res.status(200).send(JSON.stringify(filteredBook, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredBook = books[isbn];

  if(!filteredBook) return res.status(404).send('Book not found');
  if(Object.keys(filteredBook.reviews).length === 0) return res.status(404).send("Book has no review");

  return res.status(200).send(JSON.stringify(filteredBook.reviews, null, 4));
});

module.exports.general = public_users;
