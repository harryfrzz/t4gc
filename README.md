# Y-Ultimate Management Platform 

A unified, open-source platform to digitize and manage Y-Ultimate’s tournaments and coaching programmes.  
This repository provides a Next.js frontend and supporting backend modules to replace ad-hoc Google Sheets and Forms with a connected, data-driven system for tournaments, players, coaches, volunteers and programme administrators.

## Mission
Enable Y-Ultimate to centralize historical data, streamline workflows, and increase visibility and engagement across tournaments and coaching programmes - improving operational transparency and program impact measurement.

## Key capabilities
**Tournament Management**
- Player & team registration with approval workflows
- Match scheduling and live scoreboards
- Roster and attendance management
- Spirit scoring with automatic calculation and leaderboards
- Photo galleries and supporter engagement / real-time updates

**Coaching Programme Management**
- Centralized child/student profiles with transfer & attendance tracking
- Home visit and LSAS assessment data integration
- Real-time session visibility and coach workload tracking
- Automated reporting: participation, gender ratio, and impact metrics

## Repository layout (high level)

```
/BackendSide            # Backend services / API (authentication, attendance, scoring, reporting)
/Frontend               # Frontend application (UI components, views)
/app                    # Next.js `app` directory (pages, routes, server components)
components/             # Reusable React components used by frontend
lib/                    # Shared helper functions and utilities
locales/                # i18n locale files and translations
public/                 # Public static assets (images, icons)
types/                  # TypeScript types & interfaces
.env.example            # Example environment variables
ENV_SETUP.md            # Environment setup notes (see file)
```

## Quick start — development (frontend)
1. Clone the repository:
   ```bash
   git clone https://github.com/harryfrzz/t4gc.git
   cd t4gc
   ```

2. Install dependencies (pick your package manager):
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Copy the example env and edit values:
   ```bash
   cp .env.example .env.local
   # edit .env.local with API keys, DB URLs, auth secrets, etc.
   ```

4. Start the dev server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   Open `http://localhost:3000`.

## Quick start — backend
- The repo contains a `BackendSide` folder for API and server logic. Typical steps:
  ```bash
  cd BackendSide
  npm install
  cp .env.example .env
  # edit BackendSide/.env with DB connection/other secrets
  npm run dev
  ```
- Confirm backend endpoints (health, auth, attendance, scoring) are reachable and the frontend `.env` points to the correct backend base URL.

## Environment & configuration
- See `ENV_SETUP.md` for environment-specific notes, recommended services and local configuration tips.
- Use `.env.example` as a template. Do **not** commit production secrets to the repository.

## Development notes & conventions
- The project uses TypeScript for type safety.
- The frontend is implemented with Next.js - server components  live in `app/`.
- Reusable UI code should go into `components/`.
- Shared utilities and API clients should be placed in `lib/`.
- Keep changes small and add unit/integration tests for new logic paths (especially scoring & attendance).

## Testing
- Add and run tests using the repo’s test runner (look for test scripts in `package.json`).
- For manual verification:
  - Create test players and teams, run through registration & approval.
  - Simulate matches and validate live scoreboard & spirit scoring aggregation.
  - Create attendance records, transfers, and LSAS assessments and confirm reports.

## Deployment
- Frontend: ideal for Vercel (Next.js). Ensure environment variables match production services and API endpoints.
- Backend: deploy to a node host / service (Heroku/Render/DigitalOcean/AWS) with secure environment variables and a managed database.
- Configure a production DB (Postgres or similar), backups, and monitoring for attendance & scoring critical data.

## Contributing
1. Open an issue for major features or bug reports.
2. Create a branch per issue (`feature/…` or `fix/…`).
3. Submit PRs with clear descriptions and small, focused changes.
4. Ensure tests pass and add tests where appropriate.

## License
MIT Licence
## Contact / maintainers
- Repo owner / maintainer: `harryfrzz` (GitHub)
- For questions, open an issue or contact the maintainers via the project’s issue tracker.

