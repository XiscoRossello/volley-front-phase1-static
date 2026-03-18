# User stories and workflows

## User Story 1

**As a prospective athlete, I want to reserve a tryout slot so that I can start the club selection process.**

### Workflow

1. Athlete opens **Tryout Booking** page.
2. Athlete selects profile and session.
3. Fork A: fields missing → show error: **"Please select an athlete and a tryout session."**
4. Fork B: selected session has no seats → show error: **"No seats left for this session. Please choose another date."**
5. Happy path: submit valid form → local seats decrease and confirmation message appears.
6. Cancellation path: athlete clicks **Cancel** → form resets and cancellation message appears.
7. Alternative ending: athlete changes session and resubmits successfully.

## User Story 2

**As a coach, I want to filter and shortlist athlete candidates so that I can prepare final evaluations.**

### Workflow

1. Coach opens **Athletes** page.
2. Coach chooses a discipline filter.
3. Fork A: no athletes match filter → show empty-state message.
4. Happy path: list displays matching cards.
5. Coach clicks **Add to shortlist** on selected athletes.
6. Coach can click **Remove from shortlist** to undo choices.
7. Alternative ending: coach switches filter to compare shortlists by discipline.
