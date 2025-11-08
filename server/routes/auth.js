const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// Register route
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 chars'),
    body('role')
      .optional()
      .custom((value) => {
        const validRoles = ['viewer', 'blogger'];
        if (!validRoles.includes(value.toLowerCase())) {
          throw new Error('Invalid role');
        }
        return true;
      }),
  ],
  authController.register
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  authController.login
);

module.exports = router;
