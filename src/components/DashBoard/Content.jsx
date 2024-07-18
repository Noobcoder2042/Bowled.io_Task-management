import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { db } from "../../firebase/Firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import EditProject from "./Editproject";

const TaskSearch = ({ searchTerm, onSearchTermChange }) => {
  const handleSearchTermChange = (event) => {
    onSearchTermChange(event.target.value);
  };

  return (
    <TextField
      id="search"
      label="Search"
      variant="outlined"
      fullWidth
      margin="normal"
      value={searchTerm}
      onChange={handleSearchTermChange}
    />
  );
};

const Content = () => {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteAlert, setDeleteAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchTermOpen, setSearchTermOpen] = useState("");
  const [searchTermInpor, setSearchTermInpor] = useState("");
  const [searchTermDone, setSearchTermDone] = useState("");
  const [filteredTasks, setFilteredTasks] = useState({
    Open: [],
    InProgress: [],
    Done: [],
  });
  const [selectedTag, setSelectedTag] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    // Filter tasks based on search terms and status
    const filteredOpenTasks = tasks.filter(
      (task) =>
        task.status === "Open" &&
        task.title.toLowerCase().includes(searchTermOpen.toLowerCase())
    );

    const filteredInProgressTasks = tasks.filter(
      (task) =>
        task.status === "In Progress" &&
        task.title.toLowerCase().includes(searchTermInpor.toLowerCase())
    );

    const filteredDoneTasks = tasks.filter(
      (task) =>
        task.status === "Done" &&
        task.title.toLowerCase().includes(searchTermDone.toLowerCase())
    );

    // Update filteredTasks with merged filters
    setFilteredTasks({
      Open: filteredOpenTasks,
      InProgress: filteredInProgressTasks,
      Done: filteredDoneTasks,
    });
  }, [searchTermOpen, searchTermInpor, searchTermDone, tasks]);

  useEffect(() => {
    // Filter tasks based on selected tag
    const filteredOpenTasks = tasks.filter(
      (task) =>
        task.status === "Open" &&
        (selectedTag === "" || task.tag === selectedTag)
    );

    const filteredInProgressTasks = tasks.filter(
      (task) =>
        task.status === "In Progress" &&
        (selectedTag === "" || task.tag === selectedTag)
    );

    const filteredDoneTasks = tasks.filter(
      (task) =>
        task.status === "Done" &&
        (selectedTag === "" || task.tag === selectedTag)
    );

    // Update filteredTasks with merged filters
    setFilteredTasks({
      Open: filteredOpenTasks,
      InProgress: filteredInProgressTasks,
      Done: filteredDoneTasks,
    });
  }, [selectedTag, tasks]);

  const handleChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setDeleteAlert({
        open: true,
        message: "Task deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting task: ", error);
      setDeleteAlert({
        open: true,
        message: `Error deleting task: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleCloseDeleteAlert = () => {
    setDeleteAlert({ ...deleteAlert, open: false });
  };

  const handleDragStart = (event, task) => {
    event.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event, status) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    try {
      await updateDoc(doc(db, "tasks", taskId), { status });

      if (status === "Done" && filteredTasks.length === 0) {
        setFilteredTasks([
          ...filteredTasks,
          tasks.find((task) => task.id === taskId),
        ]);
      }

      setDeleteAlert({
        open: true,
        message: "Task status updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating task status: ", error);
      setDeleteAlert({
        open: true,
        message: `Error updating task status: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleEditTask = async (task) => {
    try {
      const taskDoc = doc(db, "tasks", task.id);
      const taskSnapshot = await getDoc(taskDoc);
      if (taskSnapshot.exists()) {
        const taskData = taskSnapshot.data();
        setEditTask({ id: taskSnapshot.id, ...taskData });
        setEditModalOpen(true);
      } else {
        console.error("Task not found");
      }
    } catch (error) {
      console.error("Error fetching task: ", error);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  return (
    <Container maxWidth="xl">
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              mt: 10,
              minWidth: 500,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <FormControl>
              <InputLabel id="demo-simple-select-label" sx={{ color: "white" }}>
                Sort by Tag
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedTag}
                label="Tag"
                onChange={handleChange}
                sx={{
                  minWidth: 150,
                  "& .MuiInputBase-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 4,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                  },
                  "& .MuiSelect-icon": {
                    color: "#fff",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Gaming">Gaming</MenuItem>
                <MenuItem value="Web3">Web3</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={10}>
            {/* Open tasks */}
            <Grid item xs={4}>
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 2,
                  maxHeight: "80vh",
                  minWidth: 300,
                  mt: 2,
                  overflow: "auto",
                }}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, "Open")}
              >
                <Typography variant="h5" gutterBottom>
                  Open
                </Typography>
                <TaskSearch
                  searchTerm={searchTermOpen}
                  onSearchTermChange={setSearchTermOpen}
                />
                {filteredTasks.Open.map((task) => (
                  <Card
                    key={task.id}
                    sx={{ mb: 2 }}
                    draggable
                    onDragStart={(event) => handleDragStart(event, task)}
                  >
                    <CardContent>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body2">
                        {task.description}
                      </Typography>
                      <Typography
                        color="text.primary"
                        fontSize={"10px"}
                        fontWeight={200}
                        sx={{
                          color: "blueviolet",
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          Due Date:{" "}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No due date"}
                        </span>{" "}
                        <span>Tag: {task.tag || "No tag"}</span>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        size="small"
                        color="error"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleEditTask(task)}
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Grid>
            {/* In Progress tasks */}
            <Grid item xs={4}>
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 2,
                  maxHeight: "80vh",
                  minWidth: 300,
                  mt: 2,
                  overflow: "auto",
                }}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, "In Progress")}
              >
                <Typography variant="h5" gutterBottom>
                  In Progress
                </Typography>
                <TaskSearch
                  searchTerm={searchTermInpor}
                  onSearchTermChange={setSearchTermInpor}
                />
                {filteredTasks.InProgress.map((task) => (
                  <Card
                    key={task.id}
                    sx={{ mb: 2 }}
                    draggable
                    onDragStart={(event) => handleDragStart(event, task)}
                  >
                    <CardContent>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body2">
                        {task.description}
                      </Typography>
                      <Typography
                        color="text.primary"
                        fontSize={"10px"}
                        fontWeight={200}
                        sx={{
                          color: "blueviolet",
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          Due Date:{" "}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No due date"}
                        </span>{" "}
                        <span>Tag: {task.tag || "No tag"}</span>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        size="small"
                        color="error"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleEditTask(task)}
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Grid>
            {/* Done tasks */}
            <Grid item xs={4}>
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 2,
                  maxHeight: "80vh",
                  minWidth: 300,
                  mt: 2,
                  overflow: "auto",
                }}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, "Done")}
              >
                <Typography variant="h5" gutterBottom>
                  Done
                </Typography>
                <TaskSearch
                  searchTerm={searchTermDone}
                  onSearchTermChange={setSearchTermDone}
                />
                {filteredTasks.Done.map((task) => (
                  <Card
                    key={task.id}
                    sx={{ mb: 2 }}
                    draggable
                    onDragStart={(event) => handleDragStart(event, task)}
                  >
                    <CardContent>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        {task.description}
                      </Typography>
                      <Typography
                        color="text.primary"
                        fontSize={"10px"}
                        fontWeight={200}
                        sx={{
                          color: "blueviolet",
                          mt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          Due Date:{" "}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No due date"}
                        </span>{" "}
                        <span>Tag: {task.tag || "No tag"}</span>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        size="small"
                        color="error"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleEditTask(task)}
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      <Snackbar
        open={deleteAlert.open}
        autoHideDuration={6000}
        onClose={handleCloseDeleteAlert}
      >
        <Alert
          onClose={handleCloseDeleteAlert}
          severity={deleteAlert.severity}
          sx={{ width: "100%" }}
        >
          {deleteAlert.message}
        </Alert>
      </Snackbar>
      {editTask && (
        <EditProject
          open={editModalOpen}
          onClose={handleCloseEditModal}
          task={editTask}
        />
      )}
    </Container>
  );
};

export default Content;
