# Chick

Find Your First 100 Customers — AI-powered GTM discovery for pre-launch founders. Chick takes a rough product idea, finds real communities/channels where the target audience actually hangs out, scores them on Reach/Receptiveness/Warmth, drafts outreach copy, and tracks outcomes to refine future suggestions.

This repo contains **two generations** of the same product, running side by side:

| | First prototype | Current stack |
|---|---|---|
| Backend | `backend/` — Python/FastAPI | `backend-nest/` — NestJS/TypeScript |
| Frontend | `frontend/` — static HTML | `frontend-react/` — React/Vite/Tailwind |
| Persistence | none (stateless) | PostgreSQL via TypeORM |
| Ports (docker compose) | frontend `:9080` | frontend `:8083` (prod) / `:5173` (dev) |

Both stacks are independently runnable and don't interfere with each other — the new stack was built in parallel rather than replacing the prototype in place, so the original demo keeps working while the rewrite is validated.

## 1. First prototype — `backend/` + `frontend/`

The original hackathon build. Two FastAPI endpoints (`/find-communities`, `/generate-playbook`) that wrap a single OpenAI call each over a static `communities.json` catalog — no database, no persisted history. The frontend is hand-written static HTML/CSS/JS with no build step: `frontend/index.html` (two-panel dashboard) and `frontend/map.html` (the orbital network-map visualization). Served by Caddy, which reverse-proxies `/api/*` to the FastAPI backend.

This is kept around as a reference and a working demo — not under active development.

## 2. Current stack — `backend-nest/` + `frontend-react/`

### Why NestJS

The prototype backend is plain Python with no types on its data model and no persistence layer at all — every request is a stateless OpenAI call over an in-memory JSON file. The product's own spec (`PRODUCT_SPEC.md`) requires a real domain model (`Brief → Result → Attempt`) with a tracking/refinement loop, which needs a real database and real typed contracts between layers.

NestJS was chosen over a lighter Node framework (plain Express, Fastify) specifically because of two things that matter for a domain this shaped:

- **TypeScript types end-to-end.** Nest's DI system, decorators, and module boundaries are designed around TypeScript from the ground up, so the same interfaces describe the HTTP layer, the service layer, and (via TypeORM entities) the persistence layer — no separate schema-validation library bolted on afterward, no drift between "what the code says" and "what's actually enforced" (`class-validator` DTOs are the single source of truth for request shapes, and are reused directly as the source for the generated Swagger types below).
- **A mature, stable ORM.** TypeORM's `Repository<T>` pattern maps directly onto the repository-interface pattern the domain model diagram (`docs/launchmap-domain-model.mmd`) already called for — entities are decorated classes, migrations/schema-sync are first-party, and the active-record/data-mapper split is a well-worn path with a decade of production use, rather than a newer/less battle-tested query builder.

The result is a small hexagonal-ish structure per module: `entities/` (TypeORM), `ports/` (repository interfaces + injection tokens), `adapters/` (TypeORM implementations of those ports), `dto/` (request/response shapes), and a service that only ever depends on the port interfaces — never on `Repository<T>` or the OpenAI SDK directly.

### What was built

- **Domain model**: `Brief` (free-text intake → AI-extracted product summary, audience segments, stage) → `Result` (channel match with a 3-axis confidence score: Reach/Receptiveness/Warmth, `confidence_total = reach*0.3 + receptiveness*0.4 + warmth*0.3`) → `Attempt` (logged outreach outcome). This reconciles the older `docs/launchmap-domain-model.mmd` diagram with the newer `PRODUCT_SPEC.md` spec into one model.
- **Persistence**: PostgreSQL via TypeORM, seeded at container start from the same static channel catalog the prototype uses (`backend/communities.json`), documented as a known limitation (no live "verified community data" integration exists).
- **AI integration**: OpenAI directly (same pattern as the prototype), standing in for the two fictitious third-party services ("Fastino" for intake extraction, "Cala" for verified community search) referenced in the hackathon design docs but never actually implemented or credentialed.
- **API docs**: OpenAPI/Swagger, generated from the DTOs and entities themselves (see below) — no hand-maintained spec to drift out of sync.
- **Frontend**: `frontend-react/` ports the prototype's orbital network-map visualization (`frontend/frontend/map.html`) to React, rescaled for the new 1-5 confidence score, plus two screens that don't exist in any prototype: the outreach-attempt logging form and a KPI/funnel/refinement-insight dashboard built directly against the new API's response shape.

## API documentation (Swagger)

`backend-nest` exposes an interactive OpenAPI UI:

- Directly on the service: **http://localhost:8081/docs**
- Through the frontend's reverse proxy: **http://localhost:8083/api/docs**

The raw OpenAPI JSON is at `/docs-json` on either path. Schemas are generated automatically at build time by the `@nestjs/swagger` CLI plugin (`backend-nest/nest-cli.json`) from the actual DTO/entity classes and their JSDoc comments — there's no separate spec file to keep in sync by hand.

## Running everything

Everything runs via a single `docker-compose.yml` at the repo root. Each stack is independent; start only what you need.

### 1. Environment files

```bash
cp backend/.env.example backend/.env
# paste your OpenAI API key into backend/.env

cp backend-nest/.env.example backend-nest/.env
# paste your OpenAI API key into backend-nest/.env (can be the same key)
```

### 2. First prototype

```bash
docker compose up -d backend frontend
```

| Service | URL |
|---|---|
| Frontend (static HTML) | http://localhost:9080 |
| Backend (FastAPI, internal only) | proxied via the frontend at `/api/*` |

### 3. Current stack

```bash
docker compose up -d postgres-nest backend-nest frontend-react
```

| Service | URL |
|---|---|
| Frontend (React, production build) | http://localhost:8083 |
| Backend (NestJS) | http://localhost:8081 |
| API docs | http://localhost:8081/docs (or http://localhost:8083/api/docs) |
| Postgres | internal only (`postgres-nest:5432`) |

For active frontend development, use the Vite dev server (HMR, real error overlay/source maps) instead of the production bundle:

```bash
docker compose up -d postgres-nest backend-nest frontend-react-dev
```

| Service | URL |
|---|---|
| Frontend (Vite dev server) | http://localhost:5173 |

### 4. Everything at once

```bash
docker compose up -d
```

### Running backend-nest outside Docker

```bash
cd backend-nest
npm install
npm run start:dev   # requires DATABASE_URL pointing at a reachable Postgres, e.g. via `docker compose up -d postgres-nest`
npm test            # Jest unit tests (ScoringService, DashboardService)
```

### Running frontend-react outside Docker

```bash
cd frontend-react
npm install
npm run dev   # proxies /api to http://localhost:8081 by default; override with API_PROXY_TARGET
```

## Project structure

```
backend/            first prototype — Python/FastAPI, stateless
frontend/            first prototype — static HTML/CSS/JS (map.html orbital view, index.html two-panel view)
backend-nest/        current backend — NestJS + TypeORM + PostgreSQL, Brief/Result/Attempt domain
frontend-react/      current frontend — React + Vite + Tailwind
docker-compose.yml   orchestrates both stacks side by side
PRODUCT_SPEC.md      product spec for the current stack ("Chick")
docs/                domain model diagrams
prototype/           hackathon-era design reference docs (HTML)
```
