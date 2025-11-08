const Post = require('../models/Post');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const category = req.query.category;
    const q = req.query.q;

    const filter = {};
    if (category && mongoose.Types.ObjectId.isValid(category)) filter.category = category;
    if (q) filter.$text = { $search: q };

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    let post;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      post = await Post.findById(idOrSlug).populate('author', 'name').populate('category', 'name');
    } else {
      post = await Post.findOne({ slug: idOrSlug }).populate('author', 'name').populate('category', 'name');
    }
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.incrementViewCount();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { title, content, category, excerpt, tags, isPublished } = req.body;
    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      category,
      excerpt,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim())) : [],
      isPublished: !!isPublished,
      featuredImage: req.file ? `/uploads/${req.file.filename}` : undefined
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    const { title, content, category, excerpt, tags, isPublished } = req.body;
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.category = category ?? post.category;
    post.excerpt = excerpt ?? post.excerpt;
    post.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t=>t.trim())) : post.tags;
    post.isPublished = typeof isPublished !== 'undefined' ? isPublished : post.isPublished;
    if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });
    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user._id, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  // simple full-text if needed; left for extendability
  try {
    const q = req.query.q || '';
    const posts = await Post.find({ $text: { $search: q } }).limit(20);
    res.json(posts);
  } catch (err) {
    next(err);
  }
};
