const { validationResult } = require('express-validator');
const Post = require('../models/Post');

exports.list = async (req,res,next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') }
    ];
    if (category) filter.category = category;
    const posts = await Post.find(filter)
      .populate('category')
      .populate('author','name email')
      .sort({createdAt:-1})
      .skip((page-1)*limit).limit(Number(limit));
    const total = await Post.countDocuments(filter);
    res.json({data:posts, meta:{total, page: Number(page), limit: Number(limit)}});
  } catch (err) { next(err); }
};

exports.get = async (req,res,next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category').populate('author','name email');
    if (!post) return res.status(404).json({error:'Not found'});
    res.json(post);
  } catch (err) { next(err); }
};

exports.create = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  try {
    const payload = { ...req.body };
    if (req.file) payload.featuredImage = `/uploads/${req.file.filename}`;
    payload.author = req.user._id;
    const post = new Post(payload);
    await post.save();
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.update = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  try {
    const update = { ...req.body, updatedAt: Date.now() };
    if (req.file) update.featuredImage = `/uploads/${req.file.filename}`;
    const post = await Post.findByIdAndUpdate(req.params.id, update, {new:true});
    if (!post) return res.status(404).json({error:'Not found'});
    res.json(post);
  } catch (err) { next(err); }
};

exports.remove = async (req,res,next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({error:'Not found'});
    res.json({message:'Deleted'});
  } catch (err) { next(err); }
};

exports.addComment = async (req,res,next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({error:'Not found'});
    post.comments.push({ authorName: req.body.authorName || 'Anonymous', text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
};
