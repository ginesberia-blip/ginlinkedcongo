// GinLinkedCongo — Auth Routes
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { Pool } = require('pg');
const router   = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { prenom, nom, email, telephone, profil, langue, password } = req.body;
    if (!prenom || !nom || !email || !password)
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email.' });

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (prenom, nom, email, telephone, profil, langue, password_hash, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING id, prenom, nom, email`,
      [prenom, nom, email, telephone || null, profil || null, langue || 'Français', hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Compte créé avec succès !', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email et mot de passe requis.' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Connexion réussie !', token, user: { id: user.id, prenom: user.prenom, nom: user.nom, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

module.exports = router;
