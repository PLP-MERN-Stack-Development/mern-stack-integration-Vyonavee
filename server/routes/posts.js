const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const ctrl = require('../controllers/postController');
const auth = require('../middleware/auth');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', auth, upload.single('featuredImage'), body('title').notEmpty(), body('content').notEmpty(), ctrl.create);
router.put('/:id', auth, upload.single('featuredImage'), body('title').notEmpty(), body('content').notEmpty(), ctrl.update);
router.delete('/:id', auth, ctrl.remove);

// comments
router.post('/:id/comments', body('text').notEmpty(), ctrl.addComment);

module.exports = router;
