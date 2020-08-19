const mongoose = require('mongoose');
require('mongoose-type-url');

const { Url } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: Url,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
