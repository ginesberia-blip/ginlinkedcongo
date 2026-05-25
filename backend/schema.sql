-- =========================================
-- GinLinkedCongo — Base de données PostgreSQL
-- Fondateur : Gines Ishtadeva Beria
-- =========================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE : Utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prenom        VARCHAR(80)  NOT NULL,
  nom           VARCHAR(80)  NOT NULL,
  email         VARCHAR(200) UNIQUE NOT NULL,
  telephone     VARCHAR(30),
  profil        VARCHAR(60),
  langue        VARCHAR(30)  DEFAULT 'Français',
  bio           TEXT,
  competences   TEXT,
  password_hash TEXT         NOT NULL,
  avatar_url    TEXT,
  is_verified   BOOLEAN      DEFAULT FALSE,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- TABLE : Opportunités
CREATE TABLE IF NOT EXISTS opportunites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre       VARCHAR(200) NOT NULL,
  description TEXT,
  type        VARCHAR(30)  NOT NULL CHECK (type IN ('emploi','stage','freelance','concours')),
  ville       VARCHAR(100),
  entreprise  VARCHAR(150),
  contact     VARCHAR(200),
  salaire     VARCHAR(80),
  is_active   BOOLEAN      DEFAULT TRUE,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- TABLE : Groupes
CREATE TABLE IF NOT EXISTS groupes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom         VARCHAR(150) NOT NULL,
  description TEXT,
  emoji       VARCHAR(10),
  membres     INT          DEFAULT 0,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- TABLE : Membres des groupes
CREATE TABLE IF NOT EXISTS groupe_membres (
  groupe_id UUID REFERENCES groupes(id) ON DELETE CASCADE,
  user_id   UUID REFERENCES users(id)   ON DELETE CASCADE,
  rejoint   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (groupe_id, user_id)
);

-- TABLE : Messages
CREATE TABLE IF NOT EXISTS messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  to_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  contenu     TEXT        NOT NULL,
  lu          BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE : Candidatures
CREATE TABLE IF NOT EXISTS candidatures (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES users(id)        ON DELETE CASCADE,
  opportunite_id UUID REFERENCES opportunites(id) ON DELETE CASCADE,
  message        TEXT,
  statut         VARCHAR(30) DEFAULT 'envoyee' CHECK (statut IN ('envoyee','vue','retenue','refusee')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- DONNÉES INITIALES : Groupes
INSERT INTO groupes (nom, description, emoji, membres) VALUES
  ('Bac & Révisions',       'Ressources, corrigés et entraide pour le baccalauréat',    '🎓', 2400),
  ('BEPC & Concours',       'Préparation aux examens et concours nationaux',             '📝', 1850),
  ('Opportunités Business', 'Idées, partenariats et projets entrepreneuriaux',           '💼', 3100),
  ('Diaspora Congolaise',   'Connecte la diaspora avec le pays d origine',              '🌍', 5600),
  ('Filières Techniques',   'Ingénierie, BTP, pétrole, informatique',                   '⚙️', 1200),
  ('Arts & Créatifs',       'Design, musique, mode, photographie congolaise',           '🎨',  980),
  ('Santé & Sciences',      'Médecine, pharmacie, biologie et recherche',               '🏥',  740),
  ('Marketing & Com',       'Communication digitale et marketing local',                '📢', 1650),
  ('Droit & Administration','Droit, administration publique et sciences politiques',    '⚖️',  560)
ON CONFLICT DO NOTHING;

-- INDEX
CREATE INDEX IF NOT EXISTS idx_users_email          ON users(email);
CREATE INDEX IF NOT EXISTS idx_opportunites_type    ON opportunites(type);
CREATE INDEX IF NOT EXISTS idx_opportunites_active  ON opportunites(is_active);
CREATE INDEX IF NOT EXISTS idx_messages_to          ON messages(to_id);
CREATE INDEX IF NOT EXISTS idx_candidatures_user    ON candidatures(user_id);
