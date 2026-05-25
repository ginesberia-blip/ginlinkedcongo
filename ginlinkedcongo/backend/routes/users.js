// GinLinkedCongo — Users Routes
const express  = require('express');
const jwt      = require('jsonwebtoken');
const { Pool } = require('pg');
const router   = express.Router();
const pool     = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware: verify JWT
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token manquant.' });
  try {
    req.user = jwt.verify(header.replace('Bearer ', ''), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide.' });
  }
}

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT id, prenom, nom, email, telephone, profil, langue, bio, competences, created_at FROM users WHERE id=$1',
    [req.user.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  res.json(result.rows[0]);
});

// PUT /api/users/me
router.put('/me', auth, async (req, res) => {
  const { prenom, nom, telephone, bio, competences } = req.body;
  const result = await pool.query(
    `UPDATE users SET prenom=$1, nom=$2, telephone=$3, bio=$4, competences=$5, updated_at=NOW()
     WHERE id=$6 RETURNING id, prenom, nom, email`,
    [prenom, nom, telephone, bio, competences, req.user.id]
  );
  res.json({ message: 'Profil mis à jour.', user: result.rows[0] });
});

module.exports = router;
