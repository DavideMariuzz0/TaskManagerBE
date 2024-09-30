import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required!" });
    }

    const task = new TaskModel({ title, description, dueDate, status });

    await task.save();

    return res.status(201).json(task);
  } catch (error) {
    console.log("Error in createTask: ", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await TaskModel.find();

    return res.status(200).json({
      length: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Error in getTasks: ", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
});

export const getTasksOrdered = asyncHandler(async (req, res) => {
  try {
    const { order } = req.params;
    let tasks = [];
    if (order === "ASC") {
      tasks = await TaskModel.find().sort({ dueDate: 1 });
    } else if (order === "DESC") {
      tasks = await TaskModel.find().sort({ dueDate: -1 });
    } else if (order === "STATUS") {
      tasks = await TaskModel.aggregate([
        {
          $addFields: {
            statusRank: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", "completed"] }, then: 1 },
                  { case: { $eq: ["$status", "in progress"] }, then: 2 },
                  { case: { $eq: ["$status", "pending"] }, then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { statusRank: 1 } },
      ]);
    } else {
      tasks = await TaskModel.find();
    }

    return res.status(200).json({
      length: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Error in getTasks: ", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Provide task id" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in getTask: ", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Provide task id" });
    }

    const { title, description, dueDate, status } = req.body;
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.log("Error in updateTask: ", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Provide task id" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    await TaskModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.log("Error in deleteTask: ", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
});
