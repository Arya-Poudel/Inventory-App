#! /usr/bin/env node
console.log('This script populates some test books, and genres to your database.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Book = require('./models/book')
var Genre = require('./models/genre')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var genres = [];
var books = [];

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  });
}


function bookCreate(title, author, genre, price, noInStock, imageUrl, cb) {
  bookdetail = { 
    title: title,
    author: author,
    price: price,
    noInStock: noInStock,
    imageUrl: imageUrl
  }
  if (genre != false) bookdetail.genre = genre
    
  var book = new Book(bookdetail);    
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  });
}


function createGenres(cb) {
    async.series([
        function(callback) {
          genreCreate("Fantasy", callback);
        },
        function(callback) {
          genreCreate("Science Fiction", callback);
        },
      ],
      // optional callback
      cb);
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('A Game Of Thrones', 'GRRM', genres[0], 2000, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIc-H9My9FtjycLDSrkfK_rv3vS-tGklB8XFQ4a1yc1WobpJeN', callback);
        },
        function(callback) {
          bookCreate('Lord Of The Rings', 'JRR Tolkein', genres[0], 5000, 3, 'https://media.thuprai.com/products/The_Lord_of_Rings.jpg', callback);
        },
        function(callback) {
          bookCreate('Dune', 'Frank Herbert', genres[1], 3000, 4, 'https://target.scene7.com/is/image/Target/GUEST_e991d295-cd18-4733-883e-b1e530fc30f9?wid=488&hei=488&fmt=pjpeg', callback);
        },
        function(callback) {
          bookCreate("The Hitchhiker's Guide to the Galaxy", 'Douglas Adams', genres[1], 500, 10, 'https://images-na.ssl-images-amazon.com/images/I/81XSN3hA5gL.jpg', callback);
        },
      ],
      // optional callback
      cb);
}

async.series([
    createGenres,
    createBooks
],

// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKs: '+books);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});