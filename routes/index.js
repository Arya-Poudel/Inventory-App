var express = require('express');
var router = express.Router();
var async = require('async');

var book_controller = require('../controllers/bookController');
var genre_controller = require('../controllers/genreController');
var Book = require('../models/book');
var Genre = require('../models/genre');

//home page
router.get('/', function(req, res, next) {
  async.parallel({
  	book_count: function(callback){
  		Book.countDocuments({}, callback);
  	},
  	genre_count: function(callback){
  		Genre.countDocuments({}, callback);
  	}
  }, function(err, results){
  	if (err) { return next(err)}
  	res.render('index', { title: 'Inventory Store', data: results});
  })
});


//routes for book
router.get('/books', book_controller.book_list);
router.get('/book/create', book_controller.book_create_get);
router.post('/book/create', book_controller.book_create_post);
router.get('/book/:id', book_controller.book_detail);
router.get('/book/:id/update', book_controller.book_update_get);
router.post('/book/:id/update', book_controller.book_update_post);
router.get('/book/:id/delete', book_controller.book_delete_get);
router.post('/book/:id/delete', book_controller.book_delete_post);

//routes for genres
router.get('/genres', genre_controller.genre_list);
router.get('/genre/create', genre_controller.genre_create_get);
router.post('/genre/create', genre_controller.genre_create_post);
router.get('/genre/:id', genre_controller.genre_detail);
router.get('/genre/:id/update', genre_controller.genre_update_get);
router.post('/genre/:id/update', genre_controller.genre_update_post);
router.get('/genre/:id/delete', genre_controller.genre_delete_get);
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

module.exports = router;