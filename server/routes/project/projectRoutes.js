const express = require("express");
const { createProject, fetchAllProjects } = require("../../controllers/projects/ProjectCOntroller");
const { addTaskToProject } = require("../../controllers/projects/TaskController");


const router = express.Router();

router.post("/create-project", createProject);
router.post('/:projectId/tasks', addTaskToProject);
router.get("/fetch-project",fetchAllProjects);


module.exports = router;