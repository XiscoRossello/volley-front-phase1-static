# User stories and workflows — Phase 2

Phase 2 reuses the two stories from Phase 1 and adds two new ones that exercise
GET endpoints from the Athletics Sports Club REST API.

## User Story 1 (reused)

**As a prospective athlete, I want to reserve a tryout slot so that I can start
the club selection process.**

- Route: `/tryouts`
- API calls: `GET /people/athletes` to populate the athlete selector.
- The booking itself stays local (write operation) until Phase 3.
- File: `user-story-tryout-booking.svg`

## User Story 2 (reused, refactored)

**As a coach, I want to filter and shortlist athlete candidates so that I can
prepare final evaluations.**

- Route: `/athletes`
- API calls: `GET /people/athletes`.
- Client-side search by name, shortlist kept in component state.
- File: `user-story-athlete-shortlist.svg`

## User Story 3 (new)

**As a club supporter, I want to browse the upcoming competitions calendar so
that I can plan which matches to attend.**

- Routes: `/competitions`, `/competitions/:publicId`.
- API calls: `GET /scheduling/competitions`, `GET /scheduling/competitions/{public_id}`,
  `GET /inventory/venues/{public_id}`.
- Fork A: backend unreachable → `ErrorState` with guidance to start Docker.
- Fork B: season filter yields no results → empty card.
- Happy path: list sorted by date, click → detail with venue and line-up.
- File: `user-story-competitions-calendar.svg`

## User Story 4 (new)

**As a coach, I want to open an athlete profile and see their upcoming training
sessions so that I can plan individual follow-ups.**

- Route: `/athletes/:publicId`
- API calls: `GET /people/athletes/{public_id}`, `GET /scheduling/trainings`.
- Fork A: unknown public id → "Athlete not found".
- Fork B: no upcoming training sessions → empty fallback message.
- Happy path: profile card + filtered/sorted upcoming trainings.
- File: `user-story-athlete-profile-trainings.svg`
