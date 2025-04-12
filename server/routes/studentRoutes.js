// routes/studentRoutes.js
const express = require("express");
const studentController = require("../controllers/studentController");

const router = express.Router();

// Get all students with pagination
router.get("/", studentController.getAllStudents);

// Get a student by ID with marks
router.get("/:id", studentController.getStudentById);

// Create a new student
router.post("/", studentController.createStudent);

// Update a student
router.put("/:id", studentController.updateStudent);

// Delete a student
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
