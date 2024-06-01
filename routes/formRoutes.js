const express = require('express');
const multer = require('multer');
const path = require('path');
const { createForm, getForms, getForm, updateForm, deleteForm } = require('../controllers/formControler');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, or PDF files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

router.post('/', upload.single('file'), createForm);
router.get('/', getForms);
router.get('/:id', getForm);
router.patch('/:id', upload.single('file'), updateForm);
router.delete('/:id', deleteForm);

module.exports = router;
