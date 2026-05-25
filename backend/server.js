// =========================================
// GinLinkedCongo — Backend Server
// Fondateur : Gines Ishtadeva Beria
// Tech : Node.js + Express + PostgreSQL
// =========================================

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const path     = require('path');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const oppRoutes     = require('./routes/opportunites');
const groupeRoutes  = require('./routes/groupes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- MIDDLEWARE ----
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- STATIC FILES (Frontend) ----
app.use(express.static(path.join(__dirname, '../frontend')));

// ---- API ROUTES ----
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/opportunites',  oppRoutes);
app.use('/api/groupes',       groupeRoutes);

// ---- HEALTH CHECK ----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'GinLinkedCongo',
    fondateur: 'Gines Ishtadeva Beria',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ---- CATCH-ALL (SPA) ----
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ---- ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ---- START ----
app.listen(PORT, () => {
  console.log(`\n🟢 GinLinkedCongo démarré sur http://localhost:${PORT}`);
  console.log(`   Fondateur : Gines Ishtadeva Beria`);
  console.log(`   Environnement : ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
