const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  employeeId: String,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

