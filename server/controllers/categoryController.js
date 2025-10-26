const { validationResult } = require('express-validator');
const Category = require('../models/Category');

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const exists = await Category.findOne({ name: req.body.name });
    if (exists)
      return res.status(400).json({ error: 'Category already exists' });

    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};
