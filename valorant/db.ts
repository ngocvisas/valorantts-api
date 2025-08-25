import { postgres } from "encore.dev/storage/postgres";
export const db = postgres.NewDatabase("main", { migrations: "./migrations" });

export async function getAgentById(id: string) {
  const rows = await db.sql`
    SELECT id, name, role, bio, image_url as "imageUrl"
    FROM agents WHERE id=${id} LIMIT 1`;
  return rows[0];
}

export async function getWeaponById(id: string) {
  const rows = await db.sql`
    SELECT id, name, type, cost, dmg_body as "dmgBody",
           dmg_head as "dmgHead", dps, image_url as "imageUrl"
    FROM weapons WHERE id=${id} LIMIT 1`;
  return rows[0];
}

