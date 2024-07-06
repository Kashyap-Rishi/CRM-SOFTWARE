import React, { useContext, useState } from "react";
import {
  useMediaQuery,
  Theme,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AllEmployeeDataContext } from "../../hooks/AllEmployeeContext";
import { AllProjectDataContext } from "../../hooks/AllProjectContext";
import ProjectCard from "../project/ProjectCard";
import { common } from "@mui/material/colors";

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
  projectName: Yup.string().required("Project Name is required"),
  deadline: Yup.date().required("Deadline is required").nullable(),
  users: Yup.array()
    .min(1, "Select at least one user")
    .required("Users are required"),
});

interface FormValues {
  projectName: string;
  deadline: string;
  users: string[];
}

interface User {
  employeeId: string;
  name: string;
}

const ProjectManagement: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<
    "completed" | "pending" | "due"
  >("pending");
  const employeeContext = useContext(AllEmployeeDataContext);
  const projectContext = useContext(AllProjectDataContext);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  if (
    !employeeContext ||
    employeeContext.data === null ||
    !projectContext ||
    projectContext.data === null
  ) {
    return <CircularProgress />;
  }

  const { data: users } = employeeContext;
  const { data: projects } = projectContext;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddProject = async (values: FormValues) => {
    try {
      const formattedValues = {
        ...values,
        deadline: new Date(values.deadline).toISOString(),
      };
      const response = await axios.post(
        "https://crm-x.onrender.com/api/project/create-project",
        formattedValues
      );
      console.log("Project added successfully:", response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const getUserDetails = (userIds: string[]): User[] => {
    return userIds
      .map((id) => {
        const user = users.find((user: any) => user._id === id);
        if (user) {
          return { employeeId: user.employeeId, name: user.name };
        }
        return undefined;
      })
      .filter((user): user is User => user !== undefined);
  };

  const filteredProjects = projects.filter((project) => {
    const deadlinePassed = new Date(project.deadline) < new Date();
    if (selectedSection === "completed") return project.completed;
    if (selectedSection === "pending")
      return !project.completed && !deadlinePassed;
    if (selectedSection === "due") return !project.completed && deadlinePassed;
    return false;
  });

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
          Previous Projects
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
          New Project
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant={selectedSection === "completed" ? "contained" : "outlined"}
          onClick={() => setSelectedSection("completed")}
          sx={{
            color: selectedSection === "completed" ? "common.white" : "green",
            backgroundColor:
              selectedSection === "completed" ? "#A7DCA5" : "inherit",
            borderColor: "green",
            "&:hover": {
              backgroundColor: "#A7DCA5",
              borderColor: common.white,
              color: common.white,
            },
          }}
        >
          Completed
        </Button>
        <Button
          variant={selectedSection === "pending" ? "contained" : "outlined"}
          onClick={() => setSelectedSection("pending")}
          sx={{
            color: selectedSection === "pending" ? "common.white" : "orange",
            backgroundColor:
              selectedSection === "pending" ? "#FFDAB8" : "inherit",
            borderColor: "orange",
            "&:hover": {
              backgroundColor: "#FFDAB8",
              borderColor: common.white,
              color: common.white,
            },
          }}
        >
          Pending
        </Button>
        <Button
          variant={selectedSection === "due" ? "contained" : "outlined"}
          onClick={() => setSelectedSection("due")}
          sx={{
            color: selectedSection === "due" ? "common.white" : "red",
            backgroundColor: selectedSection === "due" ? "#FB726A" : "inherit",
            borderColor: "red",
            "&:hover": {
              backgroundColor: "#FB726A",
              borderColor: common.white,
              color: common.white,
            },
          }}
        >
          Due
        </Button>
      </Box>

      <Box sx={{ marginTop: 2 }}>
        {filteredProjects.map((project) => {
          const projectUsers = getUserDetails(project.users);
          return (
            <ProjectCard
              username={username}
              key={project._id}
              task={project.tasks}
              projectName={project.name}
              completed={project.completed}
              deadline={project.deadline}
              users={projectUsers}
              projectId={project._id}
            />
          );
        })}
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              projectName: "",
              deadline: "",
              users: [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddProject}
          >
            {({
              values,
              handleChange,
              handleBlur,
              setFieldValue,
              touched,
              errors,
            }) => (
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
                    onChange={(event) =>
                      setFieldValue("users", event.target.value as string[])
                    }
                    input={<OutlinedInput label="Users" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    error={touched.users && Boolean(errors.users)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.employeeId} value={user.employeeId}>
                        <ListItemText
                          primary={`${user.employeeId} (${user.name})`}
                        />
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
    </Box>
  );
};

export default ProjectManagement;
