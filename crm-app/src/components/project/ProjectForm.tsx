import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface ProjectFormProps {
  addProject: (project: { name: string; deadline: string }) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ addProject }) => {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({ name, deadline });
    setName('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Project
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProjectForm;
