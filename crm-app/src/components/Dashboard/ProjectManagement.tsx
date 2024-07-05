import React, { useState } from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import ProjectList from '../project/ProjectList';
import ProjectForm from '../project/ProjectForm';
import TaskForm from '../task/TaskForm';
import TaskList from '../task/TaskList';

interface Task {
  name: string;
  deadline: string;
}

interface Project {
  name: string;
  deadline: string;
  tasks: Task[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const addProject = (project: Omit<Project, 'tasks'>) => {
    setProjects([...projects, { ...project, tasks: [] }]);
  };

  const addTask = (task: Task) => {
    if (selectedProject) {
      const updatedProjects = projects.map((project) =>
        project === selectedProject ? { ...project, tasks: [...project.tasks, task] } : project
      );
      setProjects(updatedProjects);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: 16 }}>
          <Typography variant="h6" gutterBottom>
            Projects
          </Typography>
          <ProjectList projects={projects} onSelectProject={setSelectedProject} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: 16 }}>
          <Typography variant="h6" gutterBottom>
            Add Project
          </Typography>
          <ProjectForm addProject={addProject} />
        </Paper>
      </Grid>
      {selectedProject && (
        <>
          <Grid item xs={12} sm={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                Tasks for {selectedProject.name}
              </Typography>
              <TaskList tasks={selectedProject.tasks} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>
                Add Task
              </Typography>
              <TaskForm addTask={addTask} />
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ProjectManagement;
