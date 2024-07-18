import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  CssBaseline,
  Modal,
  Fade,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const Addproject = ({ openModal, handleCloseModal, handleAddProject }) => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("Open");

  const handleTaskTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleTaskDueDateChange = (event) => {
    setTaskDueDate(event.target.value);
  };

  const handleTaskStatusChange = (event) => {
    setTaskStatus(event.target.value);
  };

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      status: taskStatus,
    };
    setTasks([...tasks, newTask]);
    handleCloseModal();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-project-modal-title"
        aria-describedby="add-project-modal-description"
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box
            sx={{
              backgroundColor: "white",
              boxShadow: 24,
              p: 4,
              maxWidth: 400,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography
              id="add-project-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Add Task
            </Typography>
            <TextField
              id="task-title"
              label="Task Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={taskTitle}
              onChange={handleTaskTitleChange}
            />
            <TextField
              id="task-description"
              label="Task Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={taskDescription}
              onChange={handleTaskDescriptionChange}
            />
            <TextField
              id="task-due-date"
              label="Due Date"
              variant="outlined"
              fullWidth
              margin="normal"
              type="date"
              value={taskDueDate}
              onChange={handleTaskDueDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="task-status-label">Status</InputLabel>
              <Select
                labelId="task-status-label"
                id="task-status"
                value={taskStatus}
                onChange={handleTaskStatusChange}
                label="Status"
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Addproject;
