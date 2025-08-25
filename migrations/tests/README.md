# Valorant API (Encore.ts + Vibe Coding)

Encore.ts backend demo for Agents, Weapons, and Loadouts. Built with AI-assisted workflow (Claude Code).

Run locally
Requirements: Encore CLI + Docker Desktop
```bash
encore run
API: http://localhost:4000

Dev Dashboard: http://localhost:9400

Endpoints
GET /agents?role=&search=

GET /weapons?type=&maxCost=&search=

POST /loadouts { agent_id, primary_id?, sidearm_id?, budget? }

GET /loadouts

GET /loadouts/:id

DELETE /loadouts/:id
