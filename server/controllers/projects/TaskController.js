const Project = require('../../models/Project');
const User = require('../../models/User');

// Add a task to a specific project
const addTaskToProject = async (req, res) => {
  const { projectId } = req.params; // Extract project ID from request parameters
  const { name, description, deadline, assignedToEmployeeId } = req.body; // Extract task details from request body

  try {
    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the user by employeeId
    const assignedUser = await User.findOne({ employeeId: assignedToEmployeeId });
    if (!assignedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new task within the project's tasks array
    const newTask = {
      name,
      description,
      deadline,
      completed: false, // Default to false
      assignedTo: assignedUser._id, // Use the user's ObjectId
    };

    // Add the new task to the project's tasks array
    project.tasks.push(newTask);
    await project.save();

    res.status(201).json(newTask); // Respond with the newly created task
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { addTaskToProject };
