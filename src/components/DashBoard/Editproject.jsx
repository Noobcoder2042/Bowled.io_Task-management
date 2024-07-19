import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/Firebase";

const EditProject = ({ open, onClose, task }) => {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedTag, setEditedTag] = useState("Marketing");
  const [editedStatus, setEditedStatus] = useState("Open");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setEditedDueDate(task.dueDate);
      setEditedTag(task.tag);
      setEditedStatus(task.status);
    }
  }, [task]);

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setEditedDescription(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setEditedDueDate(event.target.value);
  };

  const handleTagChange = (event) => {
    setEditedTag(event.target.value);
  };

  const handleStatusChange = (event) => {
    setEditedStatus(event.target.value);
  };

  const handleSave = async () => {
    try {
      // Update task document in Firestore
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        title: editedTitle,
        description: editedDescription,
        dueDate: editedDueDate,
        status: editedStatus,
        tag: editedTag,
      });

      // Show success snackbar
      setSnackbarOpen(true);

      // Close the edit dialog
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error (e.g., display an error message)
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="edited-title"
            label="Title"
            type="text"
            fullWidth
            value={editedTitle}
            onChange={handleTitleChange}
          />
          <TextField
            margin="dense"
            id="edited-description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editedDescription}
            onChange={handleDescriptionChange}
          />
          <TextField
            margin="dense"
            id="edited-due-date"
            label="Due Date"
            type="date"
            fullWidth
            value={editedDueDate}
            onChange={handleDueDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="edited-tag-label">Tag</InputLabel>
            <Select
              labelId="edited-tag-label"
              id="edited-tag"
              value={editedTag}
              onChange={handleTagChange}
            >
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Development">Development</MenuItem>
              <MenuItem value="Gaming">Gaming</MenuItem>
              <MenuItem value="Web3">Web3</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="edited-status-label">Status</InputLabel>
            <Select
              labelId="edited-status-label"
              id="edited-status"
              value={editedStatus}
              onChange={handleStatusChange}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          The task update is done
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProject;
