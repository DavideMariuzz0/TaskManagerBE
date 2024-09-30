import TaskModel from "../../models/tasks/TaskModel.js";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTasksOrdered,
  updateTask,
} from "./taskController.js";

jest.mock("../../models/tasks/TaskModel.js");

describe("Task Controller Tests", () => {
  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const req = {
        body: {
          title: "Test Task",
          description: "Test Description",
          dueDate: new Date("2023-09-30T00:00:00.000Z"),
          status: "pending",
        },
      };

      const taskMock = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        status: req.body.status,
        save: jest.fn().mockResolvedValue(req.body),
      };

      TaskModel.mockImplementation(() => taskMock);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
    });

    it("should return 400 if title is missing", async () => {
      const req = {
        body: {
          description: "Test Description",
          dueDate: new Date("2023-09-30T00:00:00.000Z"),
          status: "pending",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Title is required!" });
    });
  });

  describe("getTasks", () => {
    it("should return all tasks successfully", async () => {
      const tasksMock = [
        {
          title: "Task 1",
          description: "Description 1",
          dueDate: new Date(),
          status: "pending",
        },
        {
          title: "Task 2",
          description: "Description 2",
          dueDate: new Date(),
          status: "completed",
        },
      ];

      TaskModel.find.mockResolvedValue(tasksMock);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        length: tasksMock.length,
        tasks: tasksMock,
      });
    });
  });

  describe("getTasksOrdered", () => {
    it("should return tasks sorted in ascending order", async () => {
      const req = { params: { order: "ASC" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTasks = [
        { title: "Task 1", dueDate: new Date("2023-09-29"), status: "pending" },
        {
          title: "Task 2",
          dueDate: new Date("2023-09-30"),
          status: "completed",
        },
      ];

      TaskModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTasks),
      });

      await getTasksOrdered(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        length: mockTasks.length,
        tasks: mockTasks,
      });
    });

    it("should return tasks sorted in descending order", async () => {
      const req = { params: { order: "DESC" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTasks = [
        {
          title: "Task 2",
          dueDate: new Date("2023-09-30"),
          status: "completed",
        },
        { title: "Task 1", dueDate: new Date("2023-09-29"), status: "pending" },
      ];

      TaskModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTasks),
      });

      await getTasksOrdered(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        length: mockTasks.length,
        tasks: mockTasks,
      });
    });

    it("should return tasks sorted by status", async () => {
      const req = { params: { order: "STATUS" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTasks = [
        { title: "Task 1", status: "pending" },
        { title: "Task 2", status: "completed" },
        { title: "Task 3", status: "in progress" },
      ];

      TaskModel.aggregate.mockResolvedValue(mockTasks);

      await getTasksOrdered(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        length: mockTasks.length,
        tasks: mockTasks,
      });
    });

    it("should return all tasks if no valid order is provided", async () => {
      const req = { params: { order: "INVALID" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTasks = [
        {
          title: "Task 1",
          description: "Description 1",
          dueDate: new Date(),
          status: "pending",
        },
      ];

      TaskModel.find.mockResolvedValue(mockTasks);

      await getTasksOrdered(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        length: mockTasks.length,
        tasks: mockTasks,
      });
    });
  });

  describe("getTask", () => {
    it("should return a task when a valid ID is provided", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTask = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
      };

      TaskModel.findById.mockResolvedValue(mockTask);

      await getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 400 if no ID is provided", async () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Provide task id" });
    });

    it("should return 400 if the task is not found", async () => {
      const req = { params: { id: "non-existent-id" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      TaskModel.findById.mockResolvedValue(null);

      await getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });

  describe("updateTask", () => {
    it("should update an existing task successfully", async () => {
      const req = {
        params: { id: "1" },
        body: {
          title: "Updated Task",
          description: "Updated Description",
          dueDate: new Date("2023-09-30T00:00:00.000Z"),
          status: "in progress",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTask = {
        id: "1",
        title: "Old Task",
        description: "Old Description",
        dueDate: new Date("2023-09-30T00:00:00.000Z"),
        status: "pending",
        save: jest.fn().mockResolvedValue(true),
      };

      TaskModel.findById.mockResolvedValue(mockTask);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(mockTask.save).toHaveBeenCalled();
    });

    it("should return 400 if no ID is provided", async () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Provide task id" });
    });

    it("should return 400 if the task is not found", async () => {
      const req = { params: { id: "non-existent-id" }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      TaskModel.findById.mockResolvedValue(null);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });

  describe("deleteTask", () => {
    it("should delete an existing task successfully", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockTask = { id: "1", title: "Test Task" };
      TaskModel.findById.mockResolvedValue(mockTask);
      TaskModel.findByIdAndDelete.mockResolvedValue(mockTask);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Task deleted" });
      expect(TaskModel.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("should return 400 if no ID is provided", async () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Provide task id" });
    });

    it("should return 400 if the task is not found", async () => {
      const req = { params: { id: "non-existent-id" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      TaskModel.findById.mockResolvedValue(null);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });
});
