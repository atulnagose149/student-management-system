// controllers/studentController.js
const pool = require("../config/db");

// Get all students with pagination
exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) FROM students");
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated students
    const result = await pool.query(
      "SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get students",
      error: error.message,
    });
  }
};

// Get a student by ID with marks
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get student details
    const studentResult = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Get student's marks with subject details
    const marksResult = await pool.query(
      `SELECT m.id, m.score, m.exam_date, s.name as subject_name, s.code as subject_code 
       FROM marks m 
       JOIN subjects s ON m.subject_id = s.id 
       WHERE m.student_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...studentResult.rows[0],
        marks: marksResult.rows,
      },
    });
  } catch (error) {
    console.error("Error getting student by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get student",
      error: error.message,
    });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, date_of_birth } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and email are required",
      });
    }

    // Check if email already exists
    const emailCheck = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Insert new student
    const result = await pool.query(
      `INSERT INTO students (first_name, last_name, email, phone, date_of_birth) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, email, phone, date_of_birth]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Student created successfully",
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, date_of_birth } = req.body;

    // Check if student exists
    const studentCheck = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if email already exists for another student
    if (email) {
      const emailCheck = await pool.query(
        "SELECT * FROM students WHERE email = $1 AND id != $2",
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Update student
    const result = await pool.query(
      `UPDATE students 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           date_of_birth = COALESCE($5, date_of_birth),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [first_name, last_name, email, phone, date_of_birth, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const studentCheck = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    if (studentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete student (marks will be deleted via CASCADE)
    await pool.query("DELETE FROM students WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};
