const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  description:String,
  deadline: Date,
  completed: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const commentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  name: String,
  deadline: Date,
  tasks: [taskSchema],
  comments: [commentSchema],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);

