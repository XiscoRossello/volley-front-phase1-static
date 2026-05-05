# User stories and workflows — Phase 3

Phase 3 completes all four Phase-2 user stories with write operations and adds two
new mutation-focused stories. All six are backed by the live Athletics Sports Club API.

---

## User Story 1 — Book a tryout session (updated)

**As a prospective athlete, I want to reserve a tryout slot so that I can start
the club selection process.**

- Route: `/tryouts`
- Read: `GET /people/athletes` — populates athlete selector.
- Write: `bookTryout()` — simulated async POST (no backend endpoint yet).
- UI feedback:
  - Submit button labelled "Booking…" and disabled while the request is in flight.
  - On success: green `<Toast>` "Booking confirmed! Your spot has been reserved."
  - On validation error: red `role="alert"` paragraph inline.
  - On server error: same inline error area shows API message.
  - Cancel: resets form and shows a "Request cancelled" toast.
- File: `user-story-tryout-booking.svg`

---

## User Story 2 — Filter & shortlist athletes (updated)

**As a coach, I want to filter and shortlist athlete candidates so that I can
prepare final evaluations.**

- Route: `/athletes`
- Read: `GET /people/athletes`
- New Phase-3 addition: "+ Register athlete" CTA links to `/athletes/new`.
- Toast shown when arriving here after a successful DELETE (router-state).
- File: `user-story-athlete-shortlist.svg`

---

## User Story 3 — Browse competitions calendar (updated)

**As a club supporter, I want to browse the upcoming competitions calendar so
that I can plan which matches to attend.**

- Routes: `/competitions`, `/competitions/:publicId`
- Read: `GET /scheduling/competitions`, `GET /scheduling/competitions/{id}`,
  `GET /inventory/venues/{id}`
- Phase-3 addition: "Edit competition" button on the detail page expands Story 6's form.
- File: `user-story-competitions-calendar.svg`

---

## User Story 4 — Athlete profile & trainings (updated)

**As a coach, I want to open an athlete profile and see their upcoming training
sessions so that I can plan individual follow-ups. I also want to keep profile
data current and remove athletes who have left the club.**

- Route: `/athletes/:publicId`
- Read: `GET /people/athletes/{id}`, `GET /scheduling/trainings`
- Write (edit): `PATCH /people/athletes/{id}` — inline `<AthleteForm>` toggled by "✏️ Edit".
  - Loading state disables form; success reloads page with toast.
- Write (delete): `DELETE /people/athletes/{id}` — requires confirmation via
  `<ConfirmDialog>`; on success redirects to `/athletes` with a toast.
- File: `user-story-athlete-profile-trainings.svg`

---

## User Story 5 — Register a new athlete (new)

**As an admin, I want to register a new athlete in the system so that they can
be assigned to trainings and competitions.**

- Route: `/athletes/new`
- Write: `POST /people/athletes` (HTTP 201)
- Form fields: first name*, last name*, email*, phone, date of birth, height (cm),
  weight (kg), jersey number.
- UI feedback:
  - Client-side validation for required fields and positive-number constraints.
  - "Register athlete" button disabled and labelled "Saving…" while request is in flight.
  - Success: redirect to `/athletes/:newId` with a "New athlete created" toast.
  - Server error: red inline `role="alert"` paragraph with API error detail.
- File: `user-story-create-athlete.svg`

---

## User Story 6 — Edit competition score & roster (new)

**As an admin, I want to update the competition results and adjust the attending
roster so that the record accurately reflects what happened on the day.**

- Route: `/competitions/:publicId` (inline form, no separate route)
- Read: `GET /scheduling/competitions/{id}`, `GET /people/athletes`,
  `GET /people/coaches`
- Write: `PATCH /scheduling/competitions/{id}` (HTTP 200)
- Form fields:
  - Score: medal counts (gold / silver / bronze) per discipline
    (sprints, long distance, relays, high jump, long jump).
  - Athletes attending: checkbox list of all athletes.
  - Coaches attending: checkbox list of all coaches.
- UI feedback:
  - "Save changes" disabled and labelled "Saving…" while PATCH is in flight.
  - Success: green toast + form closes; page auto-refreshes.
  - Error: red toast + inline error paragraph.
- File: `user-story-edit-competition.svg`
