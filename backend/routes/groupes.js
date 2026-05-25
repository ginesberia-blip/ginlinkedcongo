// GinLinkedCongo — Groupes Routes
const express  = require('express');
const { Pool } = require('pg');
const router   = express.Router();
const pool     = new Pool({ connectionString: process.env.DATABASE_URL });

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM groupes ORDER BY membres DESC');
  res.json(result.rows);
});

router.post('/:id/rejoindre', async (req, res) => {
  // TODO: ajouter l'utilisateur au groupe
  res.json({ message: 'Vous avez rejoint le groupe.' });
});

module.exports = router;
