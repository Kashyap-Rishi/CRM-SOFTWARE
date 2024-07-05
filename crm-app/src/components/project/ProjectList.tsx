import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface Task {
  name: string;
  deadline: string;
}

interface Project {
  name: string;
  deadline: string;
  tasks: Task[];
}

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject }) => {
  return (
    <List>
      {projects.map((project, index) => (
        <ListItem button key={index} onClick={() => onSelectProject(project)}>
          <ListItemText
            primary={project.name}
            secondary={`Deadline: ${project.deadline}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ProjectList;
