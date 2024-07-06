import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface TaskCardProps {
  name: string;
  description: string;
  deadline: string;
  users: string;
  completed: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  name,
  description,
  deadline,
  users,
  completed,
}) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ marginBottom: 1 }}>
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 1 }}
        >
          {description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 1 }}
        >
          Deadline: {new Date(deadline).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assigned to: {users}
        </Typography>
      </CardContent>
      <CardActions>
        {completed ? (
          <Box
            sx={{
              backgroundColor: "#A7DCA5",
              color: "white",
              padding: "4px 8px",
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            Completed
          </Box>
        ) : (
          <>
            <IconButton size="small">
              <CheckCircleIcon />
            </IconButton>
            <IconButton size="small">
              <CancelIcon />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default TaskCard;
