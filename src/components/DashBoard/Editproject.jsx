import React, { useState } from "react";
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
} from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/Firebase";

const EditProject = ({ open, onClose, task }) => {
  const [editedTitle, setEditedTitle] = useState(task ? task.title : "");
  const [editedDescription, setEditedDescription] = useState(
    task ? task.description : ""
  );
  const [editedDueDate, setEditedDueDate] = useState(task ? task.dueDate : "");
  const [editedStatus, setEditedStatus] = useState(task ? task.status : "Open");
  const [editedTag, setEditedTag] = useState(task ? task.tag : "Marketing");

  console.log(task);
  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setEditedDescription(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setEditedDueDate(event.target.value);
  };

  const handleStatusChange = (event) => {
    setEditedStatus(event.target.value);
  };

  const handleTagChange = (event) => {
    setEditedTag(event.target.value);
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

      // Close the edit dialog
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
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
          <InputLabel id="edited-status-label">Status</InputLabel>
          <Select
            labelId="edited-status-label"
            id="edited-status"
            value={editedStatus}
            onChange={handleStatusChange}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
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
  );
};

export default EditProject;
