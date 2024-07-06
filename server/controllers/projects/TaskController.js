const Project = require('../../models/project');
const User = require('../../models/user');

const addTaskToProject = async (req, res) => {
  const { projectId } = req.params; 
  const { name, description, deadline, assignedToEmployeeId } = req.body;

  try {
 
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const assignedUser = await User.findOne({ employeeId: assignedToEmployeeId });
    if (!assignedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTask = {
      name,
      description,
      deadline,
      completed: false,
      assignedTo: assignedUser._id,
    };


    project.tasks.push(newTask);
    await project.save();

    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { addTaskToProject };
