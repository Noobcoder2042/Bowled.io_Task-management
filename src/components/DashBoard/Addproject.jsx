import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import { v4 as uuidv4 } from "uuid";

const Addproject = ({ openModal, handleCloseModal }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const uid = currentUser ? currentUser.uid : null;
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("Open");
  const [taskTag, setTaskTag] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [openAlert, setOpenAlert] = useState(false);

  const generateTaskId = () => {
    return uuidv4();
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (!uid) return;
      const q = query(collection(db, "tasks"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const tasksArray = querySnapshot.docs.map((doc) => doc.data());
      setTasks(tasksArray);
    };

    fetchTasks();
  }, [uid]);

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

  const handleTaskTagChange = (event) => {
    setTaskTag(event.target.value);
  };

  const handleAddTask = async () => {
    if (
      !taskTitle.trim() ||
      !taskDescription.trim() ||
      !taskDueDate ||
      !taskTag
    ) {
      setAlert({ message: "Please fill out all fields.", severity: "error" });
      setOpenAlert(true);
      return;
    }

    const newTask = {
      taskId: generateTaskId(),
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      status: taskStatus,
      tag: taskTag,
      uid: uid,
    };

    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      console.log("Document written with ID: ", docRef.id);
      setAlert({ message: "Task added successfully!", severity: "success" });
      setOpenAlert(true);
      handleCloseModal();

      const q = query(collection(db, "tasks"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const updatedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error adding task to Firestore: ", error);
      setAlert({
        message: `Error adding task: ${error.message}`,
        severity: "error",
      });
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
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
              required
              id="task-title"
              label="Task Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={taskTitle}
              onChange={handleTaskTitleChange}
            />
            <TextField
              required
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
              required
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
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="task-tag-label">Tag</InputLabel>
              <Select
                labelId="task-tag-label"
                id="task-tag"
                value={taskTag}
                onChange={handleTaskTagChange}
                label="Tag"
              >
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Gaming">Gaming</MenuItem>
                <MenuItem value="Web3">Web3</MenuItem>
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
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Addproject;
