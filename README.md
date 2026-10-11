# Survey Analytics App

A full-stack survey creation, response collection, and reporting application built with React + Vite + TypeScript, Tailwind CSS, Framer Motion, Express, MongoDB, and Redis.

## Features
- Create surveys with single-choice, multi-choice, and short-text questions.
- Share a survey by its ID and collect responses.
- Validate required answers and question types on the API.
- Analytics endpoint aggregates response totals and choice distributions; Redis caches results and is invalidated after a response.
- Animated result cards and charts, responsive UI, and CSV report export.
- MongoDB indexes, API error handling, health endpoint, test coverage for core validation, and deployment notes for Vercel/Railway.

## Local setup
Requires Node.js 20+, Docker, and npm.

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev:server
```
In another terminal:
```bash
npm run dev:client
```
Open http://localhost:5173. The frontend uses `/api` and Vite proxies it to `http://localhost:4000` in development.

## API
- `GET /api/health` — service status
- `GET /api/surveys` — list surveys
- `POST /api/surveys` — create survey `{ title, description?, questions: [{ text, type, required?, options? }] }`
- `GET /api/surveys/:id` — survey details
- `POST /api/surveys/:id/responses` — submit `{ answers: [{ questionId, value }] }`
- `GET /api/surveys/:id/analytics` — aggregate response counts and choice breakdowns

## CSV export
Use **Export CSV** on the analytics view. The report contains question, answer option, and response count columns. Text answers are exported as individual answer rows.

## Deploy
### API on Railway
1. Create a Railway project from this repository and set the service root to repository root.
2. Set the start command to `npm run dev -w server` for quick demo only, or configure `npm run start -w server` for production (recommended).
3. Add `MONGODB_URI` using a managed MongoDB connection, `REDIS_URL` using a Redis service, `CLIENT_ORIGIN` to your Vercel URL, and `PORT` if required by the platform.
4. Expose the API service and check `/api/health`.

### Frontend on Vercel
1. Import the repository into Vercel and set the root directory to `client` (enable install from parent workspace if prompted) or deploy from the monorepo root with the client build command `npm run build -w client` and output directory `client/dist`.
2. Set `VITE_API_URL` to the public Railway API origin (e.g. `https://your-api.up.railway.app/api`).
3. Add the Vercel origin to the API's `CLIENT_ORIGIN` environment variable and redeploy.

## Notes
This is a portfolio starter, not a hardened public survey platform. It does not include user authentication, abuse prevention, or anonymous response privacy controls. Add rate limiting, auth/ownership checks, consent/retention policies, and production secrets management before collecting sensitive real-world responses. Redis is an optional cache: when unavailable, analytics falls back to MongoDB. No deployment or usage metrics are claimed as measured.
# Survey-Analytics-App
