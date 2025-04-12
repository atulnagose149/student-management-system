// routes/subjectRoutes.js
const express = require("express");
const subjectController = require("../controllers/subjectController");

const router = express.Router();

// Get all subjects
router.get("/", subjectController.getAllSubjects);

// Get a subject by ID
router.get("/:id", subjectController.getSubjectById);

// Create a new subject
router.post("/", subjectController.createSubject);

module.exports = router;
