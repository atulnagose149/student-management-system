// routes/markRoutes.js
const express = require("express");
const markController = require("../controllers/markController");

const router = express.Router();

// Add a mark for a student
router.post("/", markController.addMark);

// Update a mark
router.put("/:id", markController.updateMark);

// Delete a mark
router.delete("/:id", markController.deleteMark);

// Get marks by student ID
router.get("/student/:student_id", markController.getMarksByStudentId);

module.exports = router;
