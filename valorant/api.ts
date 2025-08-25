import { api } from "encore.dev/api";
import { db, getAgentById, getWeaponById } from "./db";
import type { Agent, Weapon, CreateLoadout, LoadoutSummary } from "./models";

// List agents
export const listAgents = api(
  { method: "GET", path: "/agents", expose: true },
  async (query?: { role?: string; search?: string }): Promise<Agent[]> => {
    const clauses = [];
    if (query?.role) clauses.push(db.sql`role=${query.role}`);
    const base = db.sql`
      SELECT id, name, role, bio, image_url as "imageUrl"
      FROM agents
    `;
    let sql = base;
    if (clauses.length) sql = db.sql`${base} WHERE ${db.sql.join(clauses, db.sql` AND `)}`;
    sql = db.sql`${sql} ORDER BY name`;

    let rows = await sql;
    if (query?.search) {
      const s = query.search.toLowerCase();
      rows = rows.filter((a: Agent) =>
        a.name.toLowerCase().includes(s) || a.bio.toLowerCase().includes(s)
      );
    }
    return rows as Agent[];
  }
);

// List weapons
export const listWeapons = api(
  { method: "GET", path: "/weapons", expose: true },
  async (query?: { type?: string; maxCost?: number; search?: string }): Promise<Weapon[]> => {
    const clauses = [];
    if (query?.type) clauses.push(db.sql`type=${query.type}`);
    if (query?.maxCost) clauses.push(db.sql`cost <= ${query.maxCost}`);
    const base = db.sql`
      SELECT id, name, type, cost, dmg_body as "dmgBody",
             dmg_head as "dmgHead", dps, image_url as "imageUrl"
      FROM weapons
    `;
    let sql = base;
    if (clauses.length) sql = db.sql`${base} WHERE ${db.sql.join(clauses, db.sql` AND `)}`;
    sql = db.sql`${sql} ORDER BY cost`;

    let rows = await sql;
    if (query?.search) {
      const s = query.search.toLowerCase();
      rows = rows.filter((w: Weapon) => w.name.toLowerCase().includes(s));
    }
    return rows as Weapon[];
  }
);

// Create loadout
export const createLoadout = api(
  { method: "POST", path: "/loadouts", expose: true },
  async (body: CreateLoadout): Promise<LoadoutSummary> => {
    if (!body.agent_id) throw new Error("agent_id is required");
    const agent = await getAgentById(body.agent_id);
    if (!agent) throw new Error("agent not found");

    let primary: Weapon | null = null;
    if (body.primary_id) {
      primary = await getWeaponById(body.primary_id);
      if (!primary) throw new Error("primary weapon not found");
    }
    let sidearm: Weapon | null = null;
    if (body.sidearm_id) {
      sidearm = await getWeaponById(body.sidearm_id);
      if (!sidearm) throw new Error("sidearm not found");
    }

    const budget = body.budget ?? 2900;
    const total_cost = (primary?.cost ?? 0) + (sidearm?.cost ?? 0);
    const within_budget = total_cost <= budget;

    const row = (await db.sql`
      INSERT INTO loadouts (agent_id, primary_id, sidearm_id, budget)
      VALUES (${agent.id}, ${primary?.id ?? null}, ${sidearm?.id ?? null}, ${budget})
      RETURNING id, agent_id, primary_id, sidearm_id, budget, created_at
    `)[0];

    return {
      id: row.id,
      agent,
      primary,
      sidearm,
      total_cost,
      budget,
      within_budget,
      created_at: row.created_at as string,
    };
  }
);

// List loadouts
export const listLoadouts = api(
  { method: "GET", path: "/loadouts", expose: true },
  async (): Promise<LoadoutSummary[]> => {
    const rows = await db.sql`
      SELECT id, agent_id, primary_id, sidearm_id, budget, created_at
      FROM loadouts ORDER BY created_at DESC
    `;
    const out: LoadoutSummary[] = [];
    for (const r of rows) {
      const agent = await getAgentById(r.agent_id);
      const primary = r.primary_id ? await getWeaponById(r.primary_id) : null;
      const sidearm = r.sidearm_id ? await getWeaponById(r.sidearm_id) : null;
      const total_cost = (primary?.cost ?? 0) + (sidearm?.cost ?? 0);
      out.push({
        id: r.id,
        agent,
        primary,
        sidearm,
        total_cost,
        budget: r.budget,
        within_budget: total_cost <= r.budget,
        created_at: r.created_at,
      });
    }
    return out;
  }
);

// Get one loadout
export const getLoadout = api(
  { method: "GET", path: "/loadouts/:id", expose: true },
  async ({ id }: { id: string }): Promise<LoadoutSummary> => {
    const rows = await db.sql`
      SELECT id, agent_id, primary_id, sidearm_id, budget, created_at
      FROM loadouts WHERE id=${id} LIMIT 1
    `;
    const r = rows[0];
    if (!r) throw new Error("not found");

    const agent = await getAgentById(r.agent_id);
    const primary = r.primary_id ? await getWeaponById(r.primary_id) : null;
    const sidearm = r.sidearm_id ? await getWeaponById(r.sidearm_id) : null;
    const total_cost = (primary?.cost ?? 0) + (sidearm?.cost ?? 0);
    return {
      id: r.id,
      agent,
      primary,
      sidearm,
      total_cost,
      budget: r.budget,
      within_budget: total_cost <= r.budget,
      created_at: r.created_at,
    };
  }
);

// Delete loadout
export const deleteLoadout = api(
  { method: "DELETE", path: "/loadouts/:id", expose: true },
  async ({ id }: { id: string }): Promise<{ ok: true }> => {
    await db.sql`DELETE FROM loadouts WHERE id=${id}`;
    return { ok: true };
  }
);

