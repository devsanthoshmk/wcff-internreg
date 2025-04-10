
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

app.post('/api/applications', async (req, res) => {
  try {
    const { name, mobile_number, email, domain, available_period, mode } = req.body;
    
    if (!name || !mobile_number || !email || !domain || !available_period || !mode) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (mode !== 'online' && mode !== 'offline') {
      return res.status(400).json({ error: 'Mode must be either "online" or "offline"' });
    }
    
    const query = `
      INSERT INTO applications (name, mobile_number, email, domain, available_period, mode)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [name, mobile_number, email, domain, available_period, mode];
    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'An application with this email already exists' 
      });
    }
    
    console.error('Error submitting application:', error);
    res.status(500).json({ 
      error: 'Server error while processing your application' 
    });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Server error while fetching applications' });
  }
});

// GET endpoint to retrieve a specific application by ID
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Server error while fetching application' });
  }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile_number, email, domain, available_period, mode } = req.body;
    
    if (!name || !mobile_number || !email || !domain || !available_period || !mode) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (mode !== 'online' && mode !== 'offline') {
      return res.status(400).json({ error: 'Mode must be either "online" or "offline"' });
    }
    
    const query = `
      UPDATE applications 
      SET name = $1, mobile_number = $2, email = $3, domain = $4, available_period = $5, mode = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [name, mobile_number, email, domain, available_period, mode, id];
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: 'An application with this email already exists' 
      });
    }
    
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Server error while updating application' });
  }
});

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Server error while deleting application' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});