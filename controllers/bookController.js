var Book = require('../models/book');
var Genre = require('../models/genre');
var async = require('async');
const { body,validationResult } = require("express-validator");

exports.book_list = function(req, res, next) {
	Book.find({}).exec(function(err, bookList){
		if (err) { return next(err); }
		res.render('book_list', { title: 'Book List', bookList: bookList });
	})
};

exports.book_detail = function(req, res, next) {
	Book.findById(req.params.id)
	.populate('genre')
	.exec(function(err, bookDetails){
		if (err) { return next(err); }
		if (bookDetails == null) {
			var err = new Error('Book not found');
			err.status = 404;
			return next(err);
		}
		res.render('book_detail', {bookDetails: bookDetails})
	});
};

exports.book_create_get = function(req, res, next){
	Genre.find()
	.exec(function(err, genreList){
		if (err) { return next(err); }
		res.render('book_form', { title: 'Create Book', genreList: genreList });
	})
};

exports.book_create_post = [

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be specified correctly.').trim().isLength({ min: 1 }).isDecimal({min:1}).escape(),
    body('noInStock', 'noInStock must be an  integer').trim().isLength({ min: 1 }).isInt({min: 0}).escape(),
    body('imageUrl', 'imageUrl must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre', 'Genre must not be empty.').trim().isLength({ min: 1 }).escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            noInStock: req.body.noInStock,
            imageUrl: req.body.imageUrl,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
	            Genre.find()
				.exec(function(err, genreList){
					if (err) { return next(err); }
					res.render('book_form', { title: 'Create Book', genreList: genreList, book: book, errors: errors.array() });
			})
			return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];

exports.book_update_get = function(req, res, next){
	 // Get book and genres for form.
    async.parallel({
        book: function(callback) {
            Book.findById(req.params.id).populate('genre').exec(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.book==null) { // No results.
                var err = new Error('Book not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('book_form', { title: 'Update Book', genreList: results.genres, book: results.book });
        });
};

exports.book_update_post =  [

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must be specified correctly.').trim().isLength({ min: 1 }).isDecimal({min:1}).escape(),
    body('noInStock', 'noInStock must be an  integer').trim().isLength({ min: 1 }).isInt({min: 0}).escape(),
    body('imageUrl', 'imageUrl must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre', 'Genre must not be empty.').trim().isLength({ min: 1 }).escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            noInStock: req.body.noInStock,
            imageUrl: req.body.imageUrl,
            genre: req.body.genre,
            _id:req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
	            Genre.find()
					 .exec(function(err, genreList){
					if (err) { return next(err); }
					res.render('book_form', { title: 'Create Book', genreList: genreList, book: book, errors: errors.array() });
			})
			return;
        }
        else {
            // Data from form is valid. Save book.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err, newbook) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(newbook.url);
                });
        }
    }
];


exports.book_delete_get = function(req, res, next){
	Book.findById(req.params.id)
		.exec(function (err, book){
			if (err) { return next(err); }
			if (book === null) {
				res.redirect('/books');
			}
			res.render('book_delete', {title: 'Delete Book', book : book})
		})
};

exports.book_delete_post = function(req, res, next){
	Book.findByIdAndRemove(req.body.id, function deleteBook(err) {
		if (err) { return next(err); }
		res.redirect('/books');
	})

};