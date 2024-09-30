# Task Management System

A simple task management system built with Node.js and Express. This application allows users to create, retrieve, update, and delete tasks, and fetch tasks in different orders.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

### Prerequisites

Before running the application, ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (v18.18.0 or later)
- [npm](https://www.npmjs.com/) (v9.8.1 or later)

### Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/task-management-system.git
cd task-management-system
```

### Install Dependencies

Once inside the project directory, install the required dependencies:

Using npm:

```bash
npm install
```

## Running the Application

### Local Development

To run the application in development mode:

```bash
npm run dev
```

This will start the application using [nodemon](https://nodemon.io/) which watches for file changes and restarts the server automatically.

### Running in Production

To run the application in production mode:

1. Build the project (if required):

```bash
npm run build
```

2. Start the application:

```bash
npm start
```

By default, the app will run on port `3000` unless specified otherwise in environment variables.

## Environment Variables

The application requires environment variables for configuration. You can define them in a `.env` file in the root of the project.

Example `.env` file:
```bash
MONGO_URI=****
CLIENT_URL=****
PORT=****
```

Make sure to set up all required variables before running the application.

## API Endpoints

### Task Management Routes

Here are the main API endpoints provided by the application:

- `POST /task/create`  
  Creates a new task.

- `GET /tasks`  
  Retrieves all tasks from the database.

- `GET /tasks/ordered/:order`  
  Retrieves tasks in a specific order.

- `GET /task/:id`  
   Retrieves a single task by its ID.

- `PATCH /task/:id`  
   Updates an existing task by its ID.

- `DELETE /task/:id`  
   Deletes a task by its ID.

## Testing

To run unit and integration tests for the application:

`bash npm test `

To run tests with coverage:

```bash
npm run test

```
