const express = require("express");
const { createProject } = require("../../controllers/projects/ProjectCOntroller");
const { addTaskToProject } = require("../../controllers/projects/TaskController");


const router = express.Router();

router.post("/create-project", createProject);
router.post('/:projectId/tasks', addTaskToProject);


module.exports = router;