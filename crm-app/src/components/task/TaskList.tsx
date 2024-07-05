import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

interface Task {
  name: string;
  deadline: string;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <List>
      {tasks.map((task, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={task.name}
            secondary={`Deadline: ${task.deadline}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;
