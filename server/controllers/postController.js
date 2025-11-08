const Post = require('../models/Post');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getAll = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
};

// @desc    Get one post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid post ID' });

    const post = await Post.findById(id)
      .populate('author', 'name')
      .populate('category', 'name');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// @desc    Search posts
// @route   GET /api/posts/search?q=term
// @access  Public
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const posts = await Post.find({ title: { $regex: q, $options: 'i' } })
      .populate('author', 'name')
      .populate('category', 'name');
    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    const { title, content, category, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category))
      return res.status(400).json({ success: false, message: 'Invalid category ID' });

    const categoryExists = await Category.findById(category);
    if (!categoryExists)
      return res.status(404).json({ success: false, message: 'Category not found' });

    const postData = {
      title,
      content,
      category,
      author: req.user._id,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      slug: title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-').slice(0, 200),
      excerpt: content.length > 200 ? content.slice(0, 197) + '...' : content
    };

    if (req.file) postData.featuredImage = req.file.filename;

    const post = new Post(postData);
    await post.save();

    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid post ID' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags ? tags.split(',').map(t => t.trim()) : post.tags;

    if (req.file) post.featuredImage = req.file.filename;

    // Regenerate slug & excerpt
    post.slug = post.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-').slice(0, 200);
    post.excerpt = post.content.length > 200 ? post.content.slice(0, 197) + '...' : post.content;

    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid post ID' });

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a comment
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid post ID' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ user: req.user._id, content });
    await post.save();

    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};
