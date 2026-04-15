# Component hierarchy map — Phase 2

See `chm.svg` for the diagram. Summary below.

## Tree

```text
App (BrowserRouter)
└── MainLayout
    ├── Header (NavLink nav)
    ├── <Outlet/>
    │   ├── HomePage
    │   ├── AthletesPage
    │   │   └── AthleteList
    │   │       └── AthleteCard
    │   ├── AthleteDetailPage *
    │   │   └── TrainingList *
    │   ├── CompetitionsPage *
    │   │   └── CompetitionList *
    │   │       └── CompetitionCard *
    │   ├── CompetitionDetailPage *
    │   ├── TryoutBookingPage
    │   │   └── TryoutBookingForm
    │   ├── CoachesPage
    │   │   └── CoachDirectory
    │   └── NotFoundPage
    └── Footer
```

`*` = new in Phase 2.

Shared cross-cutting components: `Spinner`, `ErrorState`.

## Data and fetch flow

All HTTP calls go through `src/api/client.ts` (`fetchJson`) and are orchestrated by
the reusable hook `src/hooks/useApi.ts`, which exposes `{ data, isLoading, error }`.

| Component                  | Endpoint(s)                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| `AthletesPage`             | `GET /people/athletes`                                                      |
| `AthleteDetailPage`        | `GET /people/athletes/{public_id}`, `GET /scheduling/trainings`             |
| `CompetitionsPage`         | `GET /scheduling/competitions`                                              |
| `CompetitionDetailPage`    | `GET /scheduling/competitions/{public_id}`, `GET /inventory/venues/{id}`    |
| `CoachDirectory`           | `GET /people/coaches`                                                       |
| `TryoutBookingForm`        | `GET /people/athletes` (selector only)                                      |

Props flow down (athlete/competition/training lists receive their data from the
parent page). Filters, search terms and the shortlist live in the owning page
(`useState`), keeping child components purely presentational.
