// controllers/subjectController.js
const pool = require('../config/db');

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects ORDER BY name');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subjects',
      error: error.message
    });
  }
};

// Get a subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM subjects WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting subject by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subject',
      error: error.message
    });
  }
};

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    
    // Validate required fields
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required'
      });
    }
    
    // Check if code already exists
    const codeCheck = await pool.query(
      'SELECT * FROM subjects WHERE code = $1',
      [code]
    );
    
    if (codeCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Subject code already exists'
      });
    }
    
    // Insert new subject
    const result = await pool.query(
      `INSERT INTO subjects (name, code) 
       VALUES ($1, $2) RETURNING *`,
      [name, code]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Subject created successfully'
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subject',
      error: error.message
    });
  }
};