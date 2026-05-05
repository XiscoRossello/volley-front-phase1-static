# Athletics Sports Club · Dynamic React App (Vite) — Phase 3

This project is a React + TypeScript + Vite frontend for the Athletics Sports Club
assignment. **Phase 3** completes the application with write operations (POST, PATCH,
DELETE), controlled forms, UI feedback (toasts, loading states, error messages), and
Docker containerisation.

---

## 1) Prerequisites

- Node.js 20+ (LTS recommended)
- npm 9+
- Docker + Docker Compose (to run the `sportsclub` backend **and** optionally this frontend)

Check versions:

```bash
node -v   # ≥ 20
npm -v    # ≥ 9
```

---

## 2) Run locally (dev mode)

1. **Start the backend** (`sportsclub` repository) so the API is reachable at
   `http://localhost:8000/api/v1`.

2. **Start this frontend**:

   ```bash
   npm install
   npm run dev
   ```

3. Open the URL printed by Vite (typically `http://localhost:5173/`).

### Override the API base URL

The frontend defaults to `http://localhost:8000/api/v1`. Override at build time:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 3) Useful scripts

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production bundle in /dist (also runs tsc)
npm run preview   # Preview the production build locally
npm run lint      # ESLint
```

---

## 4) Extra credit — Docker

A **multi-stage Dockerfile** and a matching `docker-compose.yml` live in `docker/`.

### Build and run with Docker Compose

```bash
# From the project root:
docker compose -f docker/docker-compose.yml up --build
```

The app will be served by NGINX at **http://localhost**.

### Build the image manually

```bash
# Build (run from project root so the Dockerfile can access src/)
docker build -f docker/Dockerfile -t volley-front .

# Run
docker run -p 80:80 volley-front
```

### Docker details

| File | Purpose |
|------|---------|
| `docker/Dockerfile` | Multi-stage: Node 20 Alpine builds `dist/`; NGINX Alpine serves it |
| `docker/docker-compose.yml` | Single-service stack exposing port 80 |
| `docker/nginx.conf` | SPA routing (`try_files … /index.html`), asset caching headers |

> **Note:** The backend's `docker-compose.yml` (in the `sportsclub` repo) is kept
> completely separate. This image only serves the static frontend bundle.

---

## 5) Tech stack and architecture

- React 18 + TypeScript + Vite
- `react-router-dom` v6 for multi-page routing
- Plain `fetch` through `src/api/client.ts` (no axios, no react-query)
- Custom **`useApi`** hook — `useEffect`-based GET with `AbortController` cancellation
- Custom **`useMutation`** hook — tracks `isLoading` / `error` / `data` for write ops
- External CSS (`src/index.css`) with design tokens — no inline styles
- Semantic HTML (`header`, `main`, `section`, `article`, `nav`, `footer`)
- Separation of concerns: pages own data fetching; form components own field state; `useMutation` owns async plumbing

### Source layout

```
src/
├── App.tsx              # Router configuration (6 page routes)
├── main.tsx
├── index.css            # Design tokens + all component styles
├── types.ts             # TypeScript types matching API schemas exactly
├── api/
│   ├── client.ts        # fetchJson + mutateJson + ApiError
│   └── endpoints.ts     # GET + POST/PATCH/DELETE helpers
├── hooks/
│   ├── useApi.ts        # Generic GET hook (loading/error/data)
│   └── useMutation.ts   # Generic write hook (NEW in Phase 3)
├── utils/
│   └── date.ts          # Date formatting helpers
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MainLayout.tsx
│   ├── Spinner.tsx
│   ├── ErrorState.tsx
│   ├── AthleteCard.tsx
│   ├── AthleteList.tsx
│   ├── CompetitionCard.tsx
│   ├── CompetitionList.tsx
│   ├── CoachDirectory.tsx
│   ├── TrainingList.tsx
│   ├── TryoutBookingForm.tsx     (Phase 3: real async submit)
│   ├── AthleteForm.tsx           (NEW — create & edit mode)
│   ├── CompetitionEditForm.tsx   (NEW — score + roster PATCH)
│   ├── Toast.tsx                 (NEW — success/error feedback)
│   └── ConfirmDialog.tsx         (NEW — delete confirmation)
├── pages/
│   ├── HomePage.tsx
│   ├── AthletesPage.tsx          (Phase 3: + Register CTA, toast)
│   ├── AthleteCreatePage.tsx     (NEW — Story 5)
│   ├── AthleteDetailPage.tsx     (Phase 3: edit + delete)
│   ├── CompetitionsPage.tsx
│   ├── CompetitionDetailPage.tsx (Phase 3: edit competition)
│   ├── TryoutBookingPage.tsx
│   ├── CoachesPage.tsx
│   └── NotFoundPage.tsx
└── data/
    └── tryouts.json              # Local mock for tryout sessions
```

---

## 6) Routes

| Path | Page | HTTP calls |
|------|------|-----------|
| `/` | HomePage | — |
| `/athletes` | AthletesPage | GET /people/athletes |
| `/athletes/new` | AthleteCreatePage | **POST** /people/athletes |
| `/athletes/:id` | AthleteDetailPage | GET /people/athletes/:id, GET /scheduling/trainings, **PATCH**, **DELETE** |
| `/competitions` | CompetitionsPage | GET /scheduling/competitions |
| `/competitions/:id` | CompetitionDetailPage | GET competition + venue + athletes + coaches, **PATCH** |
| `/tryouts` | TryoutBookingPage | GET /people/athletes, **POST** (simulated) |
| `/coaches` | CoachesPage | GET /people/coaches |
| `*` | NotFoundPage | — |

---

## 7) User stories (6)

Full workflows and mock-ups live in [`phase3-delivery/`](phase3-delivery):

1. **Tryout booking** · `user-story-tryout-booking.svg` — POST booking
2. **Filter & shortlist athletes** · `user-story-athlete-shortlist.svg` — GET + CTA to create
3. **Browse competitions calendar** · `user-story-competitions-calendar.svg` — GET + edit entry point
4. **Athlete profile + edit + delete** · `user-story-athlete-profile-trainings.svg` — PATCH + DELETE
5. **Register new athlete** · `user-story-create-athlete.svg` — POST
6. **Edit competition score & roster** · `user-story-edit-competition.svg` — PATCH

Component hierarchy map: [`phase3-delivery/component-hierarchy-map.md`](phase3-delivery/component-hierarchy-map.md) and [`phase3-delivery/chm.svg`](phase3-delivery/chm.svg).

---

## 8) UI feedback (Phase 3 requirements)

| Requirement | Implementation |
|-------------|---------------|
| Disable submit while loading | `disabled={isLoading} aria-busy={isLoading}` on every submit button |
| Loading label | Button text changes to "Saving…" / "Booking…" / "Deleting…" |
| Success message | `<Toast variant="success">` — auto-dismisses after 4 s |
| Error message | `<p className="form-error" role="alert">` inline; `<Toast variant="error">` for mutation failures |
| Destructive confirm | `<ConfirmDialog>` inline (no `window.confirm`) |

---

## 9) HTTP verbs used

| Verb | Where |
|------|-------|
| GET | Every read (useApi hook) |
| POST | Story 1 (booking, simulated), Story 5 (create athlete) |
| PATCH | Story 4 (edit athlete), Story 6 (edit competition) |
| DELETE | Story 4 (delete athlete → 204) |

---

## 10) Quick grading checks

### Story 1 · Tryout booking (`/tryouts`)
- Athlete selector populated from live API.
- Submit with empty fields → inline error.
- Valid submit → 1.2 s loading state → green toast "Booking confirmed!".
- Type "fail" in the notes field → server error path fires.
- Cancel → toast "Request cancelled."

### Story 2 · Shortlist athletes (`/athletes`)
- "+ Register athlete" button links to `/athletes/new`.
- Delete an athlete from Story 4, navigate back → green toast shown.

### Story 4 · Athlete profile (`/athletes/:id`)
- "✏️ Edit" → inline `<AthleteForm>` pre-filled; PATCH on submit.
- "🗑 Delete" → `<ConfirmDialog>`; DELETE → redirect to `/athletes` with toast.
- "Deleting…" label and disabled buttons while DELETE is in flight.

### Story 5 · Create athlete (`/athletes/new`)
- All required field validation fires before the request.
- POST → redirect to new athlete's detail page + toast.
- Backend error (e.g. duplicate email) → red inline message.

### Story 6 · Edit competition (`/competitions/:id`)
- "✏️ Edit competition" expands `<CompetitionEditForm>`.
- Medal counts per discipline + checkbox rosters.
- PATCH → page reloads + green toast.
