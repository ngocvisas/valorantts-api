test("agents, weapons and loadout flow", async (t) => {
  const agents = await t.client.valorant.listAgents();
  t.ok(Array.isArray(agents));
  t.ok(agents.some(a => a.id === "jett"));

  const weapons = await t.client.valorant.listWeapons({ type: "Rifle", maxCost: 3000 });
  t.ok(weapons.some(w => w.id === "vandal"));

  const load = await t.client.valorant.createLoadout({
    agent_id: "jett",
    primary_id: "vandal",
    sidearm_id: "classic",
    budget: 3000,
  });
  t.equal(load.agent.id, "jett");
  t.equal(load.primary?.id, "vandal");
  t.equal(load.within_budget, true);

  const got = await t.client.valorant.getLoadout({ id: load.id });
  t.equal(got.id, load.id);

  const del = await t.client.valorant.deleteLoadout({ id: load.id });
  t.equal(del.ok, true);
});
