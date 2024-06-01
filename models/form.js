const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true
  },
  email: {
    type: String,
    //required: true
  },
  file: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
