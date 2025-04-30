# DTS Challenge Technical Test - (4537) Software Developer

## Overview

This project implements a simple Task Management System as part of the DTS Developer Technical Test. It allows caseworkers to create, view, update, and delete their tasks through a user-friendly web interface powered by a backend API.

## Technologies Used

- **Frontend:** React, TypeScript, Material UI (`@mui/material`, `@mui/x-date-pickers`), `axios`, `react-router-dom`, `dayjs`
- **Backend:** Node.js, Express.js, `pg` (for PostgreSQL interaction)
- **Database:** PostgreSQL (managed with pgAdmin 4)
- **Testing:** Jest, Supertest

## Setup Instructions

Follow these steps to get the project running locally.

### Backend Setup

1.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Set up PostgreSQL:**

    - Ensure you have PostgreSQL installed and running, and that you have access through pgAdmin 4.
    - Create a database for this application.
    - Update the PostgreSQL connection details (host, port, username, password, database name) in your backend's configuration files (e.g., `.env` or a configuration module).

3.  **Run the backend server:**

    ```bash
    npm run start:server
    ```

    The backend server will typically start on `http://localhost:3001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd client-admin
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the frontend application:**

    ```bash
    npm run start:client-server
    ```

    The frontend application will typically start on `http://localhost:3039` (or another port provided by Vite).

4.  **Navigate to frontend application:**

    Open your browser and go to `http://localhost:3039/tasks` (or another port provided by Vite) to start using it.


## API Endpoints

The backend API provides the following endpoints:

### Tasks

- **`GET /tasks`**: Retrieve all tasks.
  - **Response:**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "title": "Task 1",
          "description": "...",
          "status": "...",
          "due_date": "..."
        },
        {
          "id": 2,
          "title": "Task 2",
          "description": "...",
          "status": "...",
          "due_date": "..."
        }
        // ... more tasks
      ]
    }
    ```
- **`POST /task`**: Create a new task.
  - **Request Body:**
    ```json
    {
      "title": "Task Title",
      "description": "Optional description",
      "status": "Completed" or "Uncompleted",
      "due_date": "YYYY-MM-DD"
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "id": 1, // Example ID
        "title": "Task Title",
        "description": "Optional description",
        "status": "Completed",
        "due_date": "2023-10-27"
      },
      "message": "Task created successfully!"
    }
    ```
- **`GET /task/:id`**: Retrieve a task by ID.
  - **Path Parameter:** `id` (the ID of the task)
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "Task Title",
        "description": "Optional description",
        "status": "Completed",
        "due_date": "2023-10-27"
      }
    }
    ```
  - **Error Response (404):**
    ```json
    {
      "success": false,
      "message": "Task not found!"
    }
    ```
- **`PUT /task/:id/update`**: Update a task.
  - **Path Parameter:** `id` (the ID of the task)
  - **Request Body:** (same as the request body for creating a task, but all fields are optional)
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "Updated Task Title",
        "description": "...",
        "status": "...",
        "due_date": "..."
      },
      "message": "Task updated successfully!"
    }
    ```
  - **Error Response (404):**
    ```json
    {
      "success": false,
      "message": "Task not found!"
    }
    ```
- **`DELETE /task/:id/destroy`**: Delete a task.
  - **Path Parameter:** `id` (the ID of the task)
  - **Response:**
    ```json
    {
      "success": true,
      "message": "Task deleted successfully!"
    }
    ```
  - **Error Response (404):**
    ```json
    {
      "success": false,
      "message": "Task not found!"
    }
    ```

## Frontend Application Features

The frontend application provides the following functionalities:

- **Task Listing:** Displays all tasks with their title, status, and due date.
- **Task Creation:** Allows users to create new tasks with a title, optional description, status (dropdown), and due date (datepicker).
- **Task Editing:** Enables users to view and edit the details of an existing task.
- **Task Deletion:** Provides a button to delete a task.
- **User Interface:** Utilizes Material UI components for a clean and user-friendly design.
- **Date Handling:** Uses the MUI DatePicker component for selecting due dates.

## Unit Tests

Both the frontend and backend include unit tests to ensure the reliability and correctness of the code.

### Backend Tests

- Located in the `backend/tests` directory.
- Uses Jest and Supertest to test API endpoints and data models.
- Run tests using:
  ```bash
  cd backend
  npm run test
  # or
  yarn test
  ```

## Validation and Error Handling

- **Backend:** Implements validation for request bodies to ensure data integrity. Returns appropriate error responses with informative messages for invalid input or other issues (e.g., task not found).

## Conclusion

This Task Management System provides a basic but functional solution for caseworkers to manage their tasks, utilizing PostgreSQL as the database. It demonstrates the ability to build a full-stack application with a RESTful API, a user-friendly frontend, unit tests, and basic validation.
