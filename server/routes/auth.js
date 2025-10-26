const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/authController');

router.post('/register', body('name').notEmpty(), body('email').isEmail(), body('password').isLength({min:6}), ctrl.register);
router.post('/login', body('email').isEmail(), body('password').notEmpty(), ctrl.login);

module.exports = router;
