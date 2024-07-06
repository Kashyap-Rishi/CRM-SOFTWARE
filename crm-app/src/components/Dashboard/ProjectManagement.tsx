import React, { useContext, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  MenuItem, Select, InputLabel, FormControl, OutlinedInput, Chip, ListItemText, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AllEmployeeDataContext } from '../../hooks/AllEmployeeContext';
import ProjectCard from '../project/ProjectCard';


const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const Content = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  padding: '20px',
});

const Sidebar = styled(Box)({
  width: '250px',
  marginRight: '20px',
  backgroundColor: '#f0f0f0',
  padding: '20px',
  borderRadius: '8px',
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const validationSchema = Yup.object({
  projectName: Yup.string().required('Project Name is required'),
  deadline: Yup.date().required('Deadline is required').nullable(),
  users: Yup.array().min(1, 'Select at least one user').required('Users are required'),
});

interface FormValues {
  projectName: string;
  deadline: string;
  users: string[];
}

const ProjectManagement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const contextValue = useContext(AllEmployeeDataContext);

  if (!contextValue || contextValue.data === null) {
    return <CircularProgress />; // Loading indicator while data is being fetched
  }

  const { data: users } = contextValue;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddProject = async (values: FormValues) => {
    try {
      // Format the deadline to match server expectations if necessary
      const formattedValues = {
        ...values,
        deadline: new Date(values.deadline).toISOString(), // Example formatting, adjust as needed
      };
      console.log(formattedValues)
      const response = await axios.post('http://localhost:8000/api/project/create-project', formattedValues);
      console.log('Project added successfully:', response.data);
      setOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Previous Projects
          </Typography>
          <Button color="inherit" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Add Project
          </Button>
        </Toolbar>
      </AppBar>
      <Content>
        <Sidebar>
          <Typography variant="h6">Previous Projects</Typography>
          {/* Add your previous projects here */}
        </Sidebar>
        {/* Main content area */}
      </Content>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              projectName: '',
              deadline: '',
              users: [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddProject}
          >
            {({ values, handleChange, handleBlur, setFieldValue, touched, errors }) => (
              <Form>
                <Field
                  as={TextField}
                  name="projectName"
                  margin="dense"
                  label="Project Name"
                  fullWidth
                  variant="outlined"
                  value={values.projectName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.projectName && Boolean(errors.projectName)}
                  helperText={touched.projectName && errors.projectName}
                />
                <Field
                  as={TextField}
                  name="deadline"
                  margin="dense"
                  label="Deadline"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={values.deadline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.deadline && Boolean(errors.deadline)}
                  helperText={touched.deadline && errors.deadline}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="users-label">Users</InputLabel>
                  <Select
                    labelId="users-label"
                    multiple
                    name="users"
                    value={values.users}
                    onChange={(event) => setFieldValue('users', event.target.value as string[])}
                    input={<OutlinedInput label="Users" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    error={touched.users && Boolean(errors.users)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.employeeId} value={`${user.employeeId}`}>
                        <ListItemText primary={`${user.employeeId} (${user.name})`} />
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.users && errors.users && (
                    <Typography color="error">{errors.users}</Typography>
                  )}
                </FormControl>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Add</Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <ProjectCard/>
    </Container>
  );
};

export default ProjectManagement;
