/* =========================================
   GinLinkedCongo — Frontend JavaScript
   Fondateur : Gines Ishtadeva Beria
   ========================================= */

// ---- PAGE NAVIGATION ----
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + id);
  if (el) {
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Close mobile menu
  document.getElementById('nav-links').classList.remove('open');
}

// ---- MOBILE MENU ----
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

// ---- LANGUAGE SELECTOR ----
function selectLang(el, lang, greeting) {
  document.querySelectorAll('.lang').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
  const msg = document.getElementById('lang-msg');
  if (msg) msg.textContent = `Langue sélectionnée : ${lang} — ${greeting}`;
}

// ---- FILTER OPPORTUNITIES ----
function filterOpp(btn, type) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.opp-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
  });
}

// ---- AUTH SWITCH ----
function switchAuth(mode, btn) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

// ---- SHOW ALERT ----
function showAlert(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show) el.classList.add('show');
  else el.classList.remove('show');
}

// ---- INSCRIPTION ----
function inscrire() {
  const prenom = document.getElementById('f-prenom')?.value.trim();
  const nom    = document.getElementById('f-nom')?.value.trim();
  const email  = document.getElementById('f-email')?.value.trim();
  const mdp    = document.getElementById('f-mdp')?.value;
  const mdp2   = document.getElementById('f-mdp2')?.value;

  showAlert('error-alert', false);
  showAlert('success-alert', false);

  if (!prenom || !nom || !email || !mdp) {
    const errEl = document.getElementById('error-msg');
    if (errEl) errEl.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
    showAlert('error-alert', true);
    return;
  }
  if (mdp !== mdp2) {
    const errEl = document.getElementById('error-msg');
    if (errEl) errEl.textContent = 'Les mots de passe ne correspondent pas.';
    showAlert('error-alert', true);
    return;
  }
  if (mdp.length < 8) {
    const errEl = document.getElementById('error-msg');
    if (errEl) errEl.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
    showAlert('error-alert', true);
    return;
  }

  // Simulate API call (replace with real API)
  const msgEl = document.getElementById('success-msg');
  if (msgEl) msgEl.textContent = `Bienvenue ${prenom} ${nom} ! Votre compte a été créé avec succès.`;
  showAlert('success-alert', true);

  // Clear form
  ['f-prenom','f-nom','f-email','f-tel','f-mdp','f-mdp2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Auto-hide after 5s
  setTimeout(() => showAlert('success-alert', false), 6000);

  // TODO: POST /api/auth/register
  // fetch('/api/auth/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ prenom, nom, email, password: mdp })
  // }).then(r => r.json()).then(data => { ... });
}

// ---- CONNEXION ----
function connecter() {
  const email = document.getElementById('l-email')?.value.trim();
  const mdp   = document.getElementById('l-mdp')?.value;

  if (!email || !mdp) {
    alert('Veuillez entrer votre email et mot de passe.');
    return;
  }

  // Show success (simulate — replace with real API call)
  showAlert('login-alert', true);
  setTimeout(() => showAlert('login-alert', false), 5000);

  // TODO: POST /api/auth/login
  // fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password: mdp })
  // }).then(r => r.json()).then(data => {
  //   if (data.token) localStorage.setItem('glc_token', data.token);
  // });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Default page
  showPage('home');
  // Nav scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.08)' : '';
  });
});
