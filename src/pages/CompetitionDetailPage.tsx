// Story 3 & 6 — competition detail with inline PATCH form (score + roster).
// Phase 3 adds an "Edit competition" toggle that expands CompetitionEditForm.

import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import CompetitionEditForm from "../components/CompetitionEditForm";
import { getCompetition, getVenue, getAthletes, getCoaches, patchCompetition } from "../api/endpoints";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import { formatDateTime } from "../utils/date";
import { CompetitionPatchInput } from "../types";

function CompetitionDetailPage() {
  const { publicId = "" } = useParams();
  const [showEditForm, setShowEditForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");

  const clearToast = useCallback(() => setToastMessage(""), []);

  // Primary fetch — the competition itself.
  const competitionState = useApi(
    (signal) => getCompetition(publicId, signal),
    [publicId],
  );

  // Secondary fetch — venue detail (depends on competition).
  const venuePublicId = competitionState.data?.venue?.public_id ?? null;
  const venueState = useApi(
    (signal) => (venuePublicId ? getVenue(venuePublicId, signal) : Promise.resolve(null)),
    [venuePublicId],
  );

  // For the edit form — athletes and coaches lists. Only fetched when form opens.
  // We pass empty deps so they load once and stay cached during the session.
  const athletesState = useApi((signal) => getAthletes(signal), []);
  const coachesState = useApi((signal) => getCoaches(signal), []);

  const { mutate: doUpdate, isLoading: isUpdating, error: updateError, reset: resetUpdate } =
    useMutation(
      (patch: CompetitionPatchInput) => patchCompetition(publicId, patch),
      {
        onSuccess: () => {
          setShowEditForm(false);
          setToastVariant("success");
          setToastMessage("Competition updated successfully.");
          // Re-fetch competition by reloading page state.
          window.location.reload();
        },
        onError: () => {
          setToastVariant("error");
          setToastMessage("Failed to update competition. Please try again.");
        },
      },
    );

  const handleEditCancel = () => {
    setShowEditForm(false);
    resetUpdate();
  };

  // ── Early returns ─────────────────────────────────────────────────────────
  if (competitionState.isLoading) return <Spinner label="Loading competition…" />;
  if (competitionState.error) return <ErrorState message={competitionState.error} />;

  const competition = competitionState.data;
  if (!competition)
    return (
      <ErrorState title="Competition not found" message="The requested competition does not exist." />
    );

  const venue = venueState.data;

  return (
    <section className="stack" aria-label="Competition detail">
      <Toast message={toastMessage} variant={toastVariant} onClose={clearToast} />

      <p>
        <Link to="/competitions">&larr; Back to competitions</Link>
      </p>

      {/* Summary card */}
      <article className="card stack">
        <header className="card-header-row">
          <div className="stack">
            <h2>{competition.name}</h2>
            <p>
              <strong>Season:</strong> {competition.season.name}
            </p>
            <p>
              <strong>When:</strong> {formatDateTime(competition.date)}
            </p>
          </div>
          {!showEditForm && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => setShowEditForm(true)}
            >
              ✏️ Edit competition
            </button>
          )}
        </header>
      </article>

      {/* Venue card */}
      <article className="card stack">
        <h3>Venue</h3>
        {!competition.venue ? <p>No venue assigned yet.</p> : null}
        {competition.venue && venueState.isLoading ? <Spinner label="Loading venue…" /> : null}
        {competition.venue && venueState.error ? <ErrorState message={venueState.error} /> : null}
        {venue ? (
          <dl className="detail-grid">
            <div>
              <dt>Name</dt>
              <dd>{venue.name}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>
                {venue.venue_type} ({venue.indoor ? "indoor" : "outdoor"})
              </dd>
            </div>
            <div>
              <dt>Capacity</dt>
              <dd>{venue.capacity ?? "—"}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{venue.address?.formatted_address ?? "—"}</dd>
            </div>
          </dl>
        ) : null}
      </article>

      {/* Score card */}
      {competition.score && (
        <article className="card stack">
          <h3>Score</h3>
          <dl className="detail-grid">
            {Object.entries(competition.score.results).map(([discipline, medals]) => (
              <div key={discipline}>
                <dt style={{ textTransform: "capitalize" }}>
                  {discipline.replace("_", " ")}
                </dt>
                <dd>
                  🥇 {medals.gold} &nbsp; 🥈 {medals.silver} &nbsp; 🥉 {medals.bronze}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      )}

      {/* Line-up card */}
      <article className="card stack">
        <h3>Line-up</h3>
        <p>
          <strong>Coaches:</strong>{" "}
          {competition.coaches.length === 0
            ? "TBD"
            : competition.coaches.map((c) => c.display_name).join(", ")}
        </p>
        <p>
          <strong>Athletes:</strong>{" "}
          {competition.athletes.length === 0 ? (
            "TBD"
          ) : (
            <span>
              {competition.athletes.map((a, i) => (
                <span key={a.public_id}>
                  {i > 0 ? ", " : ""}
                  <Link to={`/athletes/${a.public_id}`}>{a.display_name}</Link>
                </span>
              ))}
            </span>
          )}
        </p>
      </article>

      {/* Story 6 — inline edit form */}
      {showEditForm && (
        <article className="card stack">
          <h3>User Story 6: Edit competition score & roster</h3>
          <p>
            As an admin, I want to update the competition results and adjust the roster
            so that the record reflects what happened on the day.
          </p>

          {athletesState.isLoading || coachesState.isLoading ? (
            <Spinner label="Loading roster data…" />
          ) : (
            <CompetitionEditForm
              competition={competition}
              athletes={athletesState.data ?? []}
              coaches={coachesState.data ?? []}
              isLoading={isUpdating}
              serverError={updateError}
              onSubmit={doUpdate}
              onCancel={handleEditCancel}
            />
          )}
        </article>
      )}
    </section>
  );
}

export default CompetitionDetailPage;
