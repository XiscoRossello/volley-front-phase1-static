# Component hierarchy map

## Main tree

App (global routing)
- MainLayout
  - Header
  - Main (Outlet)
    - HomePage
    - AthletesPage (user story 2)
      - AthleteList
        - AthleteCard
    - TryoutBookingPage (user story 1)
      - TryoutBookingForm
    - CoachesPage (support view)
      - CoachDirectory
    - NotFoundPage
  - Footer

## Data and props flow

- `AthletesPage`
  - Imports `src/data/athletes.json`.
  - Stores athletes, active filter, and shortlist in `useState`.
  - Uses `useMemo` for discipline options and filtered list.
  - Passes filtered athletes and callbacks to `AthleteList`.

- `AthleteList`
  - Receives athlete array and shortlist IDs by props.
  - Renders one `AthleteCard` per athlete.

- `AthleteCard`
  - Receives one athlete and `onToggleShortlist` callback.
  - Triggers parent state update on button click.

- `TryoutBookingForm`
  - Imports `athletes.json` and `tryouts.json`.
  - Stores local form state, errors, confirmations, and sessions in `useState`.
  - Decreases `seatsLeft` locally after successful confirmation.

- `CoachDirectory`
  - Imports `coaches.json`.
  - Stores coach list in `useState` and renders support cards.
