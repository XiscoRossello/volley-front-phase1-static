# Athletics Sports Club · Dynamic React App (Vite) — Phase 2

This project is a React + TypeScript + Vite frontend for the Athletics Sports
Club assignment. **Phase 2** upgrades the static Phase 1 prototype into a
dynamic, multi-page application that consumes the local Athletics Sports Club
REST API (Django Ninja, provided separately).

Only **GET** endpoints are used. Create/update/delete operations are deferred to
Phase 3 as required by the assignment.

## 1) Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Docker + Docker Compose, to run the `sportsclub` backend that ships this API

Check versions:

```bash
node -v
npm -v
```

## 2) Run locally

1. **Start the backend** (in the `sportsclub` repository) with Docker Compose so
   the API is reachable at `http://localhost:8000/api/v1`. The OpenAPI docs are
   exposed at `http://localhost:8000/api/v1/docs`.
2. **Start this frontend**:

   ```bash
   npm install
   npm run dev
   ```

3. Open the URL printed by Vite (typically `http://localhost:5173/`).

### Configuring the API base URL

The frontend defaults to `http://localhost:8000/api/v1`. You can override it by
setting `VITE_API_BASE_URL` (for example in `.env.local`):

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 3) Useful scripts

```bash
npm run dev       # start the Vite dev server
npm run build     # production build in /dist (also type-checks via tsc)
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## 4) Tech stack and architecture

- React 18 + TypeScript + Vite
- `react-router-dom` for multi-page routing
- Plain `fetch` through `src/api/client.ts` (no axios / no react-query)
- Custom `useApi` hook in `src/hooks/useApi.ts` that wraps `useEffect`,
  `useState`, abortable requests, loading and error states
- External CSS (`src/index.css`) with design tokens; no inline styles
- Semantic HTML (`header`, `main`, `section`, `article`, `nav`, `footer`)
- Separation of concerns: pages own data fetching and state, presentational
  components receive props only

### Source layout

```
src/
├── App.tsx              # Router configuration
├── main.tsx
├── index.css            # Design tokens + shared styles
├── api/
│   ├── client.ts        # fetchJson + ApiError + base URL resolution
│   └── endpoints.ts     # Typed GET helpers (all endpoints used)
├── hooks/
│   └── useApi.ts        # Generic data-fetching hook (loading/error/data)
├── utils/
│   └── date.ts          # Date formatting helpers
├── types.ts             # TS types that mirror the API schemas
├── components/          # Presentational + shared components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MainLayout.tsx
│   ├── Spinner.tsx              (new in Phase 2)
│   ├── ErrorState.tsx           (new in Phase 2)
│   ├── AthleteCard.tsx
│   ├── AthleteList.tsx
│   ├── CompetitionCard.tsx      (new in Phase 2)
│   ├── CompetitionList.tsx      (new in Phase 2)
│   ├── TrainingList.tsx         (new in Phase 2)
│   ├── CoachDirectory.tsx
│   └── TryoutBookingForm.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── AthletesPage.tsx
│   ├── AthleteDetailPage.tsx         (new in Phase 2)
│   ├── CompetitionsPage.tsx          (new in Phase 2)
│   ├── CompetitionDetailPage.tsx     (new in Phase 2)
│   ├── TryoutBookingPage.tsx
│   ├── CoachesPage.tsx
│   └── NotFoundPage.tsx
└── data/
    └── tryouts.json     # Local mock for the still-local tryout form
```

## 5) Routes

| Path                         | Page                     | GET endpoints called                                                                                                                   |
| ---------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                          | HomePage                 | —                                                                                                                                      |
| `/athletes`                  | AthletesPage             | `/people/athletes`                                                                                                                     |
| `/athletes/:publicId`        | AthleteDetailPage        | `/people/athletes/{public_id}`, `/scheduling/trainings`                                                                                |
| `/competitions`              | CompetitionsPage         | `/scheduling/competitions`                                                                                                             |
| `/competitions/:publicId`    | CompetitionDetailPage    | `/scheduling/competitions/{public_id}`, `/inventory/venues/{public_id}`                                                                |
| `/tryouts`                   | TryoutBookingPage        | `/people/athletes` (selector only)                                                                                                     |
| `/coaches`                   | CoachesPage              | `/people/coaches`                                                                                                                     |
| `*`                          | NotFoundPage             | —                                                                                                                                      |

## 6) User stories (4)

Full workflows and mock-ups live in [`phase2-static-delivery/`](phase2-static-delivery):

1. **Tryout booking** · `user-story-tryout-booking.svg`
2. **Filter & shortlist athletes** · `user-story-athlete-shortlist.svg`
3. **Browse the competitions calendar** · `user-story-competitions-calendar.svg`
4. **Athlete profile with upcoming trainings** · `user-story-athlete-profile-trainings.svg`

The updated component hierarchy map is in
[`phase2-static-delivery/chm.svg`](phase2-static-delivery/chm.svg) and its
narrative companion is in `component-hierarchy-map.md`.

## 7) Loading and error handling

- Every fetch is triggered from `useEffect` via the `useApi` hook.
- While a request is in flight, components render a `<Spinner/>`.
- On failure, components render an `<ErrorState/>` with a human-readable
  message. If the backend is not running, the thrown `ApiError` tells the user
  to start the Docker Compose stack.
- Requests are aborted if the component unmounts (via `AbortController`).

## 8) Quick grading checks (teacher guide)

### User Story 1 · Tryout booking (`/tryouts`)

- Backend must be running → athlete selector is populated from `/people/athletes`.
- Submit without values → `"Please select an athlete and a tryout session."`
- Pick the session `Track Speed Assessment` → `"No seats left for this session..."`
- Valid submission → confirmation + local seat decrement.
- `Cancel` → form reset + cancellation message.

### User Story 2 · Shortlist athletes (`/athletes`)

- Loading state visible while the list is being fetched.
- Stop the backend container and reload → error state appears.
- Type a name in the search box → filtered list.
- Type a nonsense string → empty-state message.
- Click `Add to shortlist` / `Remove from shortlist` → counter updates.
- Click `View profile` → navigates to `/athletes/:publicId`.

### User Story 3 · Competitions calendar (`/competitions`)

- Spinner → list rendered sorted by date.
- Season filter narrows the list.
- Click `View details` → `CompetitionDetailPage` shows venue (extra fetch) and
  line-up with clickable athletes.

### User Story 4 · Athlete profile + trainings (`/athletes/:publicId`)

- Profile data appears from `GET /people/athletes/{public_id}`.
- Below, upcoming training sessions are loaded from `/scheduling/trainings`,
  filtered to `date >= now` and sorted ascending.
- Visiting an unknown `publicId` → "Athlete not found" error state.

## 9) Notes for grading

- `node_modules` is required for Vite tooling and is excluded from the submitted
  archive.
- The `docker compose up -d` command to launch the backend is intentionally not
  included here; it belongs to the separate `sportsclub` repository.
- Phase 1 planning artefacts remain in
  [`phase1-static-delivery/`](phase1-static-delivery) for reference.
