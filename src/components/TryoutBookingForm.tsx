// Story 1 — tryout booking with real async submit.
// The form is a controlled component; every field is bound to useState.
// bookTryout simulates a POST (no backend endpoint exists) so the loading
// state, success toast and error message can all be exercised live.

import { useCallback, useMemo, useState } from "react";
import tryoutsData from "../data/tryouts.json";
import { TryoutSession } from "../types";
import { getAthletes, bookTryout } from "../api/endpoints";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import ErrorState from "./ErrorState";
import Spinner from "./Spinner";
import Toast from "./Toast";

interface BookingForm {
  athletePublicId: string;
  sessionId: number;
  notes: string;
}

const EMPTY_FORM: BookingForm = { athletePublicId: "", sessionId: 0, notes: "" };

function TryoutBookingForm() {
  const athletesState = useApi((signal) => getAthletes(signal), []);
  const [sessions, setSessions] = useState<TryoutSession[]>(tryoutsData);
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [validationError, setValidationError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");

  const clearToast = useCallback(() => setToastMessage(""), []);

  const { mutate, isLoading, error: serverError } = useMutation(bookTryout, {
    onSuccess: () => {
      // Decrement the booked session's seat count locally.
      setSessions((current) =>
        current.map((s) =>
          s.id === form.sessionId ? { ...s, seatsLeft: s.seatsLeft - 1 } : s,
        ),
      );
      setToastMessage("Booking confirmed! Your spot has been reserved.");
      setForm(EMPTY_FORM);
    },
  });

  const selectedSession = useMemo(
    () => sessions.find((s) => s.id === form.sessionId),
    [sessions, form.sessionId],
  );

  const handleFieldChange = <K extends keyof BookingForm>(
    field: K,
    value: BookingForm[K],
  ) => {
    setValidationError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.athletePublicId || !form.sessionId) {
      setValidationError("Please select an athlete and a tryout session.");
      return;
    }
    if (!selectedSession) {
      setValidationError("Selected session is not valid.");
      return;
    }
    if (selectedSession.seatsLeft <= 0) {
      setValidationError("No seats left for this session. Please choose another date.");
      return;
    }

    await mutate(form);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setValidationError("");
    setToastMessage("Request cancelled. No booking was made.");
  };

  const displayError = validationError || serverError;

  return (
    <section className="card stack" aria-label="Tryout booking form">
      <Toast message={toastMessage} variant="success" onClose={clearToast} />

      <h2>User Story 1: Book a tryout session</h2>
      <p>
        As a prospective athlete, I want to reserve a tryout slot so that I can start
        the club selection process.
      </p>

      {athletesState.isLoading ? <Spinner label="Loading athletes from the API…" /> : null}
      {athletesState.error ? <ErrorState message={athletesState.error} /> : null}

      {!athletesState.isLoading && !athletesState.error ? (
        <form className="stack" onSubmit={handleSubmit}>
          <label className="field" htmlFor="tb-athlete">
            Athlete profile
            <select
              id="tb-athlete"
              value={form.athletePublicId}
              onChange={(e) => handleFieldChange("athletePublicId", e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select athlete</option>
              {(athletesState.data ?? []).map((a) => (
                <option key={a.public_id} value={a.public_id}>
                  {a.first_name} {a.last_name}
                  {a.jersey_number !== null ? ` (#${a.jersey_number})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="tb-session">
            Tryout session
            <select
              id="tb-session"
              value={form.sessionId}
              onChange={(e) => handleFieldChange("sessionId", Number(e.target.value))}
              disabled={isLoading}
            >
              <option value={0}>Select session</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} — {s.date} ({s.seatsLeft} seats left)
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="tb-notes">
            Notes (optional)
            <textarea
              id="tb-notes"
              rows={3}
              value={form.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Mention position, injuries, or goals…"
              disabled={isLoading}
            />
          </label>

          <div className="action-row">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Booking…" : "Confirm booking"}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>

          {displayError && (
            <p className="form-error" role="alert">
              {displayError}
            </p>
          )}
        </form>
      ) : null}
    </section>
  );
}

export default TryoutBookingForm;
