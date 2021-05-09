var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre', required: true}],
    price: {type: Number, required: true},
    noInStock: {type: Number, required: true},
    imageUrl: {type: String, required: true}
  }
);

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return '/book/' + this._id;
});

//Export model
module.exports = mongoose.model('Book', BookSchema);