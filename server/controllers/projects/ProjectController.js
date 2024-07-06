const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../utils/response");
const Project = require("../../models/Project");
const User = require("../../models/user");

const createProject = async (req, res) => {
  const { projectName, deadline, users } = req.body;

  try {
    const allUsers = await User.find({ employeeId: { $in: users } });

    if (allUsers.length !== users.length) {
      return res.status(400).json({ message: "Some users not found" });
    }

    const project = new Project({
      name: projectName,
      deadline,
      users: allUsers.map((user) => user._id),
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

    sendSuccessResponse(res, 200, projects);
  } catch (error) {
    console.error("Error fetching customers:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

const updateCompleted = async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { completed: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    sendSuccessResponse(res, 200, project);
  } catch (error) {
    console.error("Error marking project as completed:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

const fetchProjectById = async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    sendSuccessResponse(res, 200, project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  createProject,
  fetchAllProjects,
  updateCompleted,
  fetchProjectById,
};
