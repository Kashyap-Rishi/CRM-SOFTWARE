const express = require("express");
const { createProject, fetchAllProjects, updateCompleted, fetchProjectById } = require("../../controllers/projects/ProjectController");
const { addTaskToProject } = require("../../controllers/projects/TaskController");


const router = express.Router();

router.post("/create-project", createProject);
router.post('/:projectId/tasks', addTaskToProject);
router.put('/mark-completed/:projectId', updateCompleted);
router.get("/fetch-project",fetchAllProjects);
router.get("/:projectId",fetchProjectById);



module.exports = router;