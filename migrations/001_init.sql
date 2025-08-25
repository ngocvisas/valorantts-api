CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS weapons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  cost INT NOT NULL,
  dmg_body INT NOT NULL,
  dmg_head INT NOT NULL,
  dps INT NOT NULL,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS loadouts (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(8), 'hex'),
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  primary_id TEXT REFERENCES weapons(id) ON DELETE SET NULL,
  sidearm_id TEXT REFERENCES weapons(id) ON DELETE SET NULL,
  budget INT NOT NULL DEFAULT 2900,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed agents
INSERT INTO agents (id, name, role, bio, image_url) VALUES
  ('jett','Jett','Duelist','Agile duelist with mobility and executes.','https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5ebf40a2dfaffb4e/5f21297f5f0cb0629a5bfcb9/V_AGENTS_587x900_Jett.png'),
  ('sova','Sova','Initiator','Recon specialist with information gathering.','https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt181ad63adc9976a4/5f2129b2e0999b628bc8eb4e/V_AGENTS_587x900_Sova.png'),
  ('sage','Sage','Sentinel','Support and area control with heals and walls.','https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt2a1c7b18aa5b1a6b/5f21297f078a8b626859f4a8/V_AGENTS_587x900_Sage.png'),
  ('omen','Omen','Controller','Smoke/TP control with paranoia.','https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt94dd043bce7fc9f2/5f21297f2ef66062fb6aa96c/V_AGENTS_587x900_Omen.png')
ON CONFLICT (id) DO NOTHING;

-- Seed weapons
INSERT INTO weapons (id,name,type,cost,dmg_body,dmg_head,dps,image_url) VALUES
  ('classic','Classic','Sidearm',0,26,78,140,''),
  ('sheriff','Sheriff','Sidearm',800,55,159,120,''),
  ('spectre','Spectre','SMG',1600,26,78,240,''),
  ('vandal','Vandal','Rifle',2900,39,156,220,''),
  ('phantom','Phantom','Rifle',2900,39,156,230,''),
  ('operator','Operator','Sniper',4700,150,255,80,'')
ON CONFLICT (id) DO NOTHING;

