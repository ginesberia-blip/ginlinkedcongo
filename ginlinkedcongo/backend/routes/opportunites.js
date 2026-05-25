// GinLinkedCongo — Opportunités Routes
const express  = require('express');
const { Pool } = require('pg');
const router   = express.Router();
const pool     = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/opportunites
router.get('/', async (req, res) => {
  const { type, ville } = req.query;
  let query = 'SELECT * FROM opportunites WHERE 1=1';
  const params = [];
  if (type)  { params.push(type);  query += ` AND type=$${params.length}`; }
  if (ville) { params.push(`%${ville}%`); query += ` AND ville ILIKE $${params.length}`; }
  query += ' ORDER BY created_at DESC LIMIT 50';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// POST /api/opportunites
router.post('/', async (req, res) => {
  const { titre, description, type, ville, entreprise } = req.body;
  if (!titre || !type) return res.status(400).json({ error: 'Titre et type requis.' });
  const result = await pool.query(
    `INSERT INTO opportunites (titre, description, type, ville, entreprise, created_at)
     VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
    [titre, description, type, ville, entreprise]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
