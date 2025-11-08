const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', postController.getAll);
router.get('/search', postController.search);
router.get('/:id', postController.getOne);

// Protected routes
router.post('/', protect, upload.single('featuredImage'), [
  body('title').notEmpty().withMessage('Title required'),
  body('content').notEmpty().withMessage('Content required'),
  body('category').notEmpty().withMessage('Category required'),
], postController.create);

router.put('/:id', protect, upload.single('featuredImage'), postController.update);
router.delete('/:id', protect, postController.remove);

router.post('/:id/comments', protect, [
  body('content').notEmpty().withMessage('Content required')
], postController.addComment);

module.exports = router;
