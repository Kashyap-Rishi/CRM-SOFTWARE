import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  useMediaQuery,
  Theme,
  LinearProgress,
} from "@mui/material";
import axios from "axios";
import { NavLink } from "react-router-dom";
import AddTaskIcon from "@mui/icons-material/AddTask";

interface User {
  employeeId: string;
  name: string;
}

interface Task {
  completed: boolean;
}

interface ProjectCardProps {
  projectName: string;
  deadline: string;
  completed: boolean;
  users: User[];
  projectId: string;
  username?: string;
  task: Task[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  deadline,
  users,
  completed,
  projectId,
  username,
  task,
}) => {
  const [overdueTimer, setOverdueTimer] = useState<string | null>(null);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  useEffect(() => {
    const calculateOverdue = () => {
      const formattedDeadline = new Date(deadline);
      const currentDate = new Date();

      if (!completed && formattedDeadline < currentDate) {
        const timeDiff = currentDate.getTime() - formattedDeadline.getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setOverdueTimer(`${days}d ${hours}h ${minutes}m ${seconds}s overdue`);
      } else {
        setOverdueTimer(null);
      }
    };

    calculateOverdue();

    const timer = setInterval(calculateOverdue, 1000);

    return () => clearInterval(timer);
  }, [deadline, completed]);

  const handleMarkAsCompleted = async () => {
    try {
      const response = await axios.put(
        `https://crm-x.onrender.com/api/project/mark-completed/${projectId}`
      );
      console.log("Marked project as completed:", response.data);
    } catch (error) {
      console.error("Error marking project as completed:", error);
    }
  };

  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const completedTasksCount = task.filter((t) => t.completed).length;
  const totalTasksCount = task.length;
  const progressPercentage =
    totalTasksCount === 0 ? 0 : (completedTasksCount / totalTasksCount) * 100;

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {projectName}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Deadline:
              </Typography>
              <Typography variant="body1">
                {getFormattedDate(new Date(deadline))}
              </Typography>
            </Box>
            {!completed && !overdueTimer && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  startIcon={<AddTaskIcon />}
                  variant="contained"
                  component={NavLink}
                  to={`/dashboard/${username}/${projectId}/task`}
                  sx={{
                    padding: isMobile ? "4px 12px" : "8px 16px",
                    fontSize: isMobile ? "0.75rem" : "1rem",
                    backgroundColor: "#7AB2B2",
                    "&:hover": {
                      backgroundColor: "#4D869C",
                    },
                  }}
                >
                  Tasks
                </Button>
              </Box>
            )}
            {overdueTimer && (
              <Typography
                component="span"
                sx={{
                  backgroundColor: "#FB726A",
                  color: "white",
                  padding: "2px 4px",
                  borderRadius: 4,
                }}
              >
                {`${overdueTimer}`}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Team Members:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {users.map((user) => (
                <Chip
                  key={user.employeeId}
                  label={user.name}
                  sx={{ margin: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tasks Completed:
            </Typography>
            <Typography variant="body2">
              {completedTasksCount} / {totalTasksCount}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{ marginBottom: 2 }}
          />

          {!completed && !overdueTimer && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleMarkAsCompleted}
              sx={{
                marginTop: 2,
                backgroundColor: "#A7DCA5",
                opacity: 0.8,
                "&:hover": {
                  "&:hover": {
                    backgroundColor: "#A7DCA5",
                    opacity: 1,
                  },
                },
              }}
            >
              Mark as Completed
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
