import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksOrdered,
  updateTask,
} from "../controllers/task/taskController.js";

const router = express.Router();

router.post("/task/create", createTask);
router.get("/tasks", getTasks);
router.get("/tasks/ordered/:order", getTasksOrdered);
router.get("/task/:id", getTask);
router.patch("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);
export default router;
