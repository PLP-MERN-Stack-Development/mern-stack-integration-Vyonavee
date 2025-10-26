const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/categoryController');

router.get('/', ctrl.list);
router.post('/', body('name').notEmpty(), ctrl.create);

module.exports = router;
