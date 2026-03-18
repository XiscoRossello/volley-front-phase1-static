import { useMemo, useState } from "react";
import athletesData from "../data/athletes.json";
import tryoutsData from "../data/tryouts.json";
import { Athlete, TryoutSession } from "../types";

interface JoinRequest {
  athleteId: number;
  sessionId: number;
  notes: string;
}

function TryoutBookingForm() {
  const [athletes] = useState<Athlete[]>(athletesData);
  const [sessions, setSessions] = useState<TryoutSession[]>(tryoutsData);
  const [request, setRequest] = useState<JoinRequest>({ athleteId: 0, sessionId: 0, notes: "" });
  const [error, setError] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === request.sessionId),
    [sessions, request.sessionId],
  );

  const handleChange = (field: keyof JoinRequest, value: string) => {
    setError("");
    setConfirmation("");

    if (field === "athleteId" || field === "sessionId") {
      setRequest((current) => ({ ...current, [field]: Number(value) }));
      return;
    }

    setRequest((current) => ({ ...current, [field]: value }));
  };

  const handleCancel = () => {
    setRequest({ athleteId: 0, sessionId: 0, notes: "" });
    setConfirmation("Request cancelled. No booking was made.");
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!request.athleteId || !request.sessionId) {
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

    setSessions((current) =>
      current.map((session) =>
        session.id === request.sessionId
          ? {
              ...session,
              seatsLeft: session.seatsLeft - 1,
            }
          : session,
      ),
    );

    setConfirmation("Booking confirmed. The seat count was updated locally.");
    setRequest({ athleteId: 0, sessionId: 0, notes: "" });
  };

  return (
    <section className="card stack" aria-label="Tryout booking form">
      <h2>User Story 1: Book a tryout session</h2>
      <p>
        As a prospective athlete, I want to reserve a tryout slot so that I can start the club selection process.
      </p>

      <form className="stack" onSubmit={handleSubmit}>
        <label className="field" htmlFor="athleteSelect">
          Athlete profile
          <select
            id="athleteSelect"
            value={request.athleteId}
            onChange={(event) => handleChange("athleteId", event.target.value)}
          >
            <option value={0}>Select athlete</option>
            {athletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.fullName} ({athlete.discipline})
              </option>
            ))}
          </select>
        </label>

        <label className="field" htmlFor="sessionSelect">
          Tryout session
          <select
            id="sessionSelect"
            value={request.sessionId}
            onChange={(event) => handleChange("sessionId", event.target.value)}
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
            onChange={(event) => handleChange("notes", event.target.value)}
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

        {error ? <p className="error">{error}</p> : null}
        {confirmation ? <p>{confirmation}</p> : null}
      </form>
    </section>
  );
}

export default TryoutBookingForm;
