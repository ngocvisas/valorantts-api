export type Role = "Duelist" | "Initiator" | "Sentinel" | "Controller";

export interface Agent {
  id: string;
  name: string;
  role: Role;
  bio: string;
  imageUrl?: string;
  abilities?: string[];
}

export type WeaponType = "Sidearm" | "SMG" | "Rifle" | "Sniper";

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  cost: number;
  dmgBody: number;
  dmgHead: number;
  dps: number;
  imageUrl?: string;
}

export interface Loadout {
  id: string;
  agent_id: string;
  primary_id: string | null;
  sidearm_id: string | null;
  budget: number;
  created_at: string;
}

export interface CreateLoadout {
  agent_id: string;
  primary_id?: string;
  sidearm_id?: string;
  budget?: number;
}

export interface LoadoutSummary {
  id: string;
  agent: Agent;
  primary?: Weapon | null;
  sidearm?: Weapon | null;
  total_cost: number;
  budget: number;
  within_budget: boolean;
  created_at: string;
}
