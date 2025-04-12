// controllers/markController.js
const pool = require('../config/db');

// Add a mark for a student
exports.addMark = async (req, res) => {
  try {
    const { student_id, subject_id, score, exam_date } = req.body;
    
    // Validate required fields
    if (!student_id || !subject_id || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Student ID, subject ID, and score are required'
      });
    }
    
    // Check if student exists
    const studentCheck = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [student_id]
    );
    
    if (studentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if subject exists
    const subjectCheck = await pool.query(
      'SELECT * FROM subjects WHERE id = $1',
      [subject_id]
    );
    
    if (subjectCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    // Check if mark already exists for this student and subject
    const markCheck = await pool.query(
      'SELECT * FROM marks WHERE student_id = $1 AND subject_id = $2',
      [student_id, subject_id]
    );
    
    if (markCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Mark already exists for this student and subject'
      });
    }
    
    // Insert new mark
    const result = await pool.query(
      `INSERT INTO marks (student_id, subject_id, score, exam_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, subject_id, score, exam_date]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Mark added successfully'
    });
  } catch (error) {
    console.error('Error adding mark:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add mark',
      error: error.message
    });
  }
};

// Update a mark
exports.updateMark = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, exam_date } = req.body;
    
    // Check if mark exists
    const markCheck = await pool.query(
      'SELECT * FROM marks WHERE id = $1',
      [id]
    );
    
    if (markCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mark not found'
      });
    }
    
    // Update mark
    const result = await pool.query(
      `UPDATE marks 
       SET score = COALESCE($1, score),
           exam_date = COALESCE($2, exam_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [score, exam_date, id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Mark updated successfully'
    });
  } catch (error) {
    console.error('Error updating mark:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mark',
      error: error.message
    });
  }
};

// Delete a mark
exports.deleteMark = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if mark exists
    const markCheck = await pool.query(
      'SELECT * FROM marks WHERE id = $1',
      [id]
    );
    
    if (markCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mark not found'
      });
    }
    
    // Delete mark
    await pool.query('DELETE FROM marks WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Mark deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mark:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mark',
      error: error.message
    });
  }
};

// Get marks by student ID
exports.getMarksByStudentId = async (req, res) => {
  try {
    const { student_id } = req.params;
    
    // Check if student exists
    const studentCheck = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [student_id]
    );
    
    if (studentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Get marks with subject details
    const result = await pool.query(
      `SELECT m.id, m.score, m.exam_date, s.name as subject_name, s.code as subject_code 
       FROM marks m 
       JOIN subjects s ON m.subject_id = s.id 
       WHERE m.student_id = $1`,
      [student_id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting marks by student ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get marks',
      error: error.message
    });
  }
};