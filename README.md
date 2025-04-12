# Student Management System

A full-stack MERN application for managing student data and marks.

## Features

- CRUD operations for students
- Tracking student marks across subjects
- Pagination for student lists
- RESTful API endpoints
- Responsive UI with Bootstrap
- User feedback with SweetAlert2

## Technology Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React.js, Bootstrap
- **Libraries**: Axios, SweetAlert2, React Router

## Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/atulnagose149/student-management-system.git
cd student-management-system
```

### 2. Database Setup

- Create a PostgreSQL database named `student_management`
- Run the SQL script in `database-schema.sql` to create the required tables

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following:

```
PORT=5000
NODE_ENV=development

# Database configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=student_management
DB_PASSWORD=your_password
DB_PORT=5432
```

Replace `your_password` with your PostgreSQL password.

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory with the following:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The server will run on http://localhost:5000

### Start the Frontend Application

```bash
cd frontend
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

### Students

- `GET /api/students` - Get all students (with pagination)
- `GET /api/students/:id` - Get a student by ID with marks
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Marks

- `GET /api/marks/student/:student_id` - Get marks by student ID
- `POST /api/marks` - Add a mark for a student
- `PUT /api/marks/:id` - Update a mark
- `DELETE /api/marks/:id` - Delete a mark

### Subjects

- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get a subject by ID
- `POST /api/subjects` - Create a new subject

## Pagination

To use pagination on the student list endpoint:

- `GET /api/students?page=1&limit=10`
  - `page`: Page number (default: 1)
  - `limit`: Number of records per page (default: 10)

## Author

Atul Nagose

# student-management-system

# student-management-system
