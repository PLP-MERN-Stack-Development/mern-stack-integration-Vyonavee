const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  authorName: String,
  text: String,
  createdAt: {type:Date, default: Date.now}
});

const PostSchema = new Schema({
  title: {type:String, required:true},
  content: {type:String, required:true},
  featuredImage: String,
  category: {type: Schema.Types.ObjectId, ref: 'Category'},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  comments: [CommentSchema],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', PostSchema);
