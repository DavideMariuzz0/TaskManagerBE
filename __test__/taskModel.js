// __mocks__/TaskModel.ts
import mongoose from "mongoose";

const TaskModel = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      required: true,
    },
  })
);

// Mock the methods you want to use
const mockTaskModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn(),
};

export default mockTaskModel;
