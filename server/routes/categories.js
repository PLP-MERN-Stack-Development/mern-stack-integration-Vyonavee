const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAll);

router.post('/', [
  body('name').notEmpty().withMessage('Name required')
], categoryController.create);

module.exports = router;
