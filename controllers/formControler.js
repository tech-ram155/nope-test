const Form = require('../models/form');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
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

exports.createForm = async (req, res) => {
  try {
    const { name, email } = req.body;
    const file = req.file;

    console.log('Received form data:', { name, email, file });

    const form = new Form({
      name,
      email,
      file: file ? `/uploads/${file.filename}` : null
    });

    await form.save();
    console.log('Form saved to MongoDB:', form);

    res.status(201).json(form);
  } catch (error) {
    console.error('Error saving form to MongoDB:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateForm = upload.single('file'), async (req, res) => {
  try {
    const { name, email } = req.body;
    const file = req.file;

    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });

    form.name = name || form.name;
    form.email = email || form.email;
    if (file) {
      if (form.fileUrl) {
        fs.unlinkSync(path.join(__dirname, '../uploads', form.fileUrl));
      }
      form.fileUrl = `/uploads/${file.filename}`;
    }

    await form.save();
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
