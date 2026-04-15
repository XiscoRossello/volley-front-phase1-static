// Story 1 — tryout booking.
// The selector is populated from the live API (read-only part), while the
// actual booking still mutates local state. Write operations will move to
// POST /something in phase 3.

import { useMemo, useState } from "react";
import tryoutsData from "../data/tryouts.json";
import { TryoutSession } from "../types";
import { getAthletes } from "../api/endpoints";
import { useApi } from "../hooks/useApi";
import ErrorState from "./ErrorState";
import Spinner from "./Spinner";

interface JoinRequest {
  athletePublicId: string;
  sessionId: number;
  notes: string;
}

const INITIAL_REQUEST: JoinRequest = {
  athletePublicId: "",
  sessionId: 0,
  notes: "",
};

function TryoutBookingForm() {
  // Athletes come from the API; sessions remain local mock data because the
  // backend does not model tryouts yet.
  const athletesState = useApi((signal) => getAthletes(signal), []);
  const [sessions, setSessions] = useState<TryoutSession[]>(tryoutsData);
  const [request, setRequest] = useState<JoinRequest>(INITIAL_REQUEST);
  const [error, setError] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");

  // Derived from the current form state so we don't need a separate piece of
  // state that could go stale when the user changes the selection.
  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === request.sessionId),
    [sessions, request.sessionId],
  );

  // Any field change wipes previous feedback — the user is starting a new
  // attempt, so old error / confirmation messages shouldn't linger.
  const handleFieldChange = <K extends keyof JoinRequest>(field: K, value: JoinRequest[K]) => {
    setError("");
    setConfirmation("");
    setRequest((current) => ({ ...current, [field]: value }));
  };

  const handleCancel = () => {
    setRequest(INITIAL_REQUEST);
    setConfirmation("Request cancelled. No booking was made.");
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation cascades: missing fields → invalid session → full session →
    // happy path. Each step short-circuits the rest.
    if (!request.athletePublicId || !request.sessionId) {
      setError("Please select an athlete and a tryout session.");
      return;
    }

    if (!selectedSession) {
      setError("Selected session is not valid.");
      return;
    }

    if (selectedSession.seatsLeft <= 0) {
      setError("No seats left for this session. Please choose another date.");
      return;
    }

    // Decrement seats locally — real persistence is a phase-3 concern.
    setSessions((current) =>
      current.map((session) =>
        session.id === request.sessionId
          ? { ...session, seatsLeft: session.seatsLeft - 1 }
          : session,
      ),
    );
    setConfirmation("Booking confirmed. The seat count was updated locally.");
    setRequest(INITIAL_REQUEST);
  };

  return (
    <section className="card stack" aria-label="Tryout booking form">
      <h2>User Story 1: Book a tryout session</h2>
      <p>
        As a prospective athlete, I want to reserve a tryout slot so that I can start the club
        selection process.
      </p>
      <p className="muted">
        Athletes are loaded from the Athletics Sports Club API. Booking submission remains local
        until phase 3 adds write operations.
      </p>

      {/* Loading / error states apply to the athlete selector. The rest of the
          form is only rendered once the list resolves successfully. */}
      {athletesState.isLoading ? <Spinner label="Loading athletes from the API..." /> : null}
      {athletesState.error ? <ErrorState message={athletesState.error} /> : null}

      {!athletesState.isLoading && !athletesState.error ? (
        <form className="stack" onSubmit={handleSubmit}>
          <label className="field" htmlFor="athleteSelect">
            Athlete profile
            <select
              id="athleteSelect"
              value={request.athletePublicId}
              onChange={(event) => handleFieldChange("athletePublicId", event.target.value)}
            >
              <option value="">Select athlete</option>
              {(athletesState.data ?? []).map((athlete) => (
                <option key={athlete.public_id} value={athlete.public_id}>
                  {athlete.first_name} {athlete.last_name}
                  {athlete.jersey_number !== null ? ` (#${athlete.jersey_number})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="sessionSelect">
            Tryout session
            <select
              id="sessionSelect"
              value={request.sessionId}
              onChange={(event) => handleFieldChange("sessionId", Number(event.target.value))}
            >
              <option value={0}>Select session</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} - {session.date} ({session.seatsLeft} seats left)
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="notes">
            Notes (optional)
            <textarea
              id="notes"
              rows={3}
              value={request.notes}
              onChange={(event) => handleFieldChange("notes", event.target.value)}
              placeholder="Mention position, injuries, or goals"
            />
          </label>

          <div className="action-row">
            <button type="submit" className="btn-primary">
              Confirm booking
            </button>
            <button type="button" className="btn-outline" onClick={handleCancel}>
              Cancel
            </button>
          </div>

          {/* Only one of these is ever shown at a time — see handleFieldChange
              which resets both on any input change. */}
          {error ? <p className="error">{error}</p> : null}
          {confirmation ? <p>{confirmation}</p> : null}
        </form>
      ) : null}
    </section>
  );
}

export default TryoutBookingForm;
