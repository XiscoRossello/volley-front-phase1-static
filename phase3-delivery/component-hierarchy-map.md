# Component Hierarchy Map — Phase 3

All parent → child relationships. Props flowing down are listed in parentheses.
New Phase-3 components are marked **[NEW]**.
Mutation hooks are shown as `useMutation(fn)`.

---

```
App  (BrowserRouter + Routes)
└── MainLayout
    ├── Header          (nav links)
    ├── <Outlet />      (renders whichever page matches the current URL)
    └── Footer

Pages wired through <Outlet />:

├── HomePage

├── TryoutBookingPage
│   └── TryoutBookingForm          [Story 1]
│       ├── useApi(getAthletes)
│       ├── useMutation(bookTryout)  [POST — simulated]
│       ├── Spinner                (label)
│       ├── ErrorState             (message)
│       └── Toast [NEW]            (message, variant, onClose)

├── AthletesPage                   [Story 2]
│   ├── useApi(getAthletes)
│   ├── Toast [NEW]                (router-state message after delete/create)
│   └── AthleteList                (athletes[], shortlist[], onToggleShortlist)
│       └── AthleteCard ×N         (athlete, isShortlisted, onToggleShortlist)

├── AthleteCreatePage [NEW]        [Story 5]
│   └── AthleteForm [NEW]          (isLoading, serverError, onSubmit, onCancel)
│       useMutation(createAthlete)   [POST /people/athletes → 201]

├── AthleteDetailPage              [Story 4]
│   ├── useApi(getAthlete)
│   ├── useApi(getTrainings)
│   ├── useMutation(patchAthlete)  [PATCH /people/athletes/:id]
│   ├── useMutation(deleteAthlete) [DELETE /people/athletes/:id → 204]
│   ├── Toast [NEW]                (message, variant, onClose)
│   ├── AthleteForm [NEW]          (initialValues, isLoading, serverError,
│   │                               onSubmit, onCancel, submitLabel)
│   │   — rendered only in "edit" mode
│   ├── ConfirmDialog [NEW]        (message, isLoading, onConfirm, onCancel)
│   │   — rendered only in "confirm-delete" mode
│   ├── Spinner                    (label)
│   ├── ErrorState                 (message)
│   └── TrainingList               (trainings[], emptyMessage)

├── CompetitionsPage               [Story 3]
│   ├── useApi(getCompetitions)
│   └── CompetitionList            (competitions[])
│       └── CompetitionCard ×N     (competition)

├── CompetitionDetailPage          [Story 3 + 6]
│   ├── useApi(getCompetition)
│   ├── useApi(getVenue)           — lazy, depends on competition.venue.public_id
│   ├── useApi(getAthletes)        — for edit form roster
│   ├── useApi(getCoaches)         — for edit form roster
│   ├── useMutation(patchCompetition) [PATCH /scheduling/competitions/:id]
│   ├── Toast [NEW]                (message, variant, onClose)
│   ├── Spinner                    (label)
│   ├── ErrorState                 (message)
│   └── CompetitionEditForm [NEW]  (competition, athletes[], coaches[],
│                                   isLoading, serverError, onSubmit, onCancel)
│       — rendered only when "Edit competition" is toggled

├── CoachesPage
│   └── CoachDirectory             (coaches[])

└── NotFoundPage
```

---

## HTTP verb coverage

| Verb   | Endpoint                              | Story |
|--------|---------------------------------------|-------|
| GET    | `/people/athletes`                    | 1, 2  |
| GET    | `/people/athletes/:id`                | 4     |
| GET    | `/people/coaches`                     | 6     |
| GET    | `/scheduling/competitions`            | 3     |
| GET    | `/scheduling/competitions/:id`        | 3, 6  |
| GET    | `/scheduling/trainings`               | 4     |
| GET    | `/inventory/venues/:id`               | 3     |
| POST   | `/people/athletes` (→ 201)            | 5     |
| POST   | *(simulated bookTryout)*              | 1     |
| PATCH  | `/people/athletes/:id`                | 4     |
| PATCH  | `/scheduling/competitions/:id`        | 6     |
| DELETE | `/people/athletes/:id` (→ 204)        | 4     |

---

## Component inventory (16 total ≥ 6 required)

**Shared / layout (5):** `Header`, `Footer`, `MainLayout`, `Spinner`, `ErrorState`

**Presentational (6):** `AthleteCard`, `AthleteList`, `CompetitionCard`,
`CompetitionList`, `CoachDirectory`, `TrainingList`

**Forms — Phase 3 new (3):** `AthleteForm`, `CompetitionEditForm`, `TryoutBookingForm`
(upgraded)

**UI feedback — Phase 3 new (2):** `Toast`, `ConfirmDialog`
