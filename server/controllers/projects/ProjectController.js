const { sendErrorResponse, sendSuccessResponse } = require("../../utils/response");
const Project = require('../../models/Project');
const User = require('../../models/user');


const createProject = async (req, res) => {
  const { projectName, deadline, users } = req.body;

  try {
   
    const allUsers = await User.find({ employeeId: { $in: users } });

    if (allUsers.length !== users.length) {
      return res.status(400).json({ message: 'Some users not found' });
    }

 
    const project = new Project({
      projectName,
      deadline,
      users: allUsers.map(user => user._id),
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const fetchAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    sendSuccessResponse(res, 200,projects);
  } catch (error) {
    console.error("Error fetching customers:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};


module.exports = { createProject, fetchAllProjects};
