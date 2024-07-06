import React, { useState, useContext, useEffect } from "react";
import {
  useMediaQuery,
  Theme,
  Button,
  Dialog,
  DialogActions,
  Grid,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ProjectDataContext } from "../../hooks/SingleProjectContext";
import { AllEmployeeDataContext } from "../../hooks/AllEmployeeContext";
import TaskCard from "./TaskCard";

const validationSchema = Yup.object({
  name: Yup.string().required("Task Name is required"),
  description: Yup.string().required("Description is required"),
  deadline: Yup.date().required("Deadline is required").nullable(),
  assignedToEmployeeId: Yup.string().required("Assigned User is required"),
});

interface FormValues {
  name: string;
  description: string;
  deadline: string;
  assignedToEmployeeId: string;
}

const CreateTaskButton: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [open, setOpen] = useState(false);
  const projectContext = useContext(ProjectDataContext);
  const employeeContext = useContext(AllEmployeeDataContext);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  useEffect(() => {
    const fetchData = async () => {
      if (projectId && projectContext?.fetchProjectData && loading) {
        await projectContext.fetchProjectData(projectId);
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, projectContext, loading]);

  if (
    !employeeContext ||
    employeeContext.data === null ||
    loading ||
    !projectContext ||
    projectContext.projectData === null
  ) {
    return <CircularProgress />;
  }

  const { data: users } = employeeContext;
  const { projectData } = projectContext;

  console.log("Project Data:", projectData);
  console.log("Users:", users);

  const filteredUsers = users.filter((user: any) =>
    projectData.users.includes(user._id)
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getUserNameById = (employeeId: string) => {
    const user = filteredUsers.find((user) => user.employeeId === employeeId);
    return user ? user.name : "";
  };
  const getUserNameById2 = (employeeId: string) => {
    const user = filteredUsers.find((user: any) => user._id === employeeId);
    return user ? user.name : "";
  };
  const handleAddTask = async (values: FormValues) => {
    try {
      const formattedValues = {
        ...values,
        deadline: new Date(values.deadline).toISOString(),
      };
      const response = await axios.post(
        `https://crm-x.onrender.com/api/project/${projectId}/tasks`,
        formattedValues
      );
      console.log("Task added successfully:", response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        fontSize={20}
      >
        <h2
          style={{
            lineHeight: isMobile ? "1.2" : "1.5",
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          All Tasks
        </h2>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleClickOpen}
          sx={{
            padding: isMobile ? "4px 12px" : "8px 16px",
            fontSize: isMobile ? "0.75rem" : "1rem",
            backgroundColor: "#7AB2B2",
            "&:hover": {
              backgroundColor: "#4D869C",
            },
          }}
        >
          New Task
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: "",
              description: "",
              deadline: "",
              assignedToEmployeeId: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddTask}
          >
            {({ values, handleChange, handleBlur, touched, errors }) => (
              <Form>
                <Field
                  as={TextField}
                  name="name"
                  margin="dense"
                  label="Task Name"
                  fullWidth
                  variant="outlined"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="description"
                  margin="dense"
                  label="Description"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
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
                  <InputLabel shrink={true} id="assignedToEmployeeId-label">
                    Assigned Employee
                  </InputLabel>
                  <Select
                    labelId="assignedToEmployeeId-label"
                    name="assignedToEmployeeId"
                    value={values.assignedToEmployeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.assignedToEmployeeId &&
                      Boolean(errors.assignedToEmployeeId)
                    }
                    variant="outlined"
                    renderValue={(selected) =>
                      getUserNameById(selected as string)
                    }
                  >
                    {filteredUsers.map((user: any) => (
                      <MenuItem key={user.employeeId} value={user.employeeId}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.assignedToEmployeeId &&
                    errors.assignedToEmployeeId && (
                      <div>{errors.assignedToEmployeeId}</div>
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
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {projectData.tasks.map((task: any) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <TaskCard
              name={task.name}
              description={task.description}
              deadline={task.deadline}
              users={getUserNameById2(task.assignedToEmployeeId)}
              completed={task.completed}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CreateTaskButton;
