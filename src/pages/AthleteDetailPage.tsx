// Story 4 — athlete profile with upcoming training sessions.
// Phase 3 adds PATCH (inline edit) and DELETE (with confirm dialog).
// Two independent fetches run in parallel for the profile + trainings.

import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import Spinner from "../components/Spinner";
import TrainingList from "../components/TrainingList";
import AthleteForm from "../components/AthleteForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import { getAthlete, getTrainings, patchAthlete, deleteAthlete } from "../api/endpoints";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import { formatDate } from "../utils/date";
import { AthleteCreateInput } from "../types";

type PanelMode = "view" | "edit" | "confirm-delete";

function AthleteDetailPage() {
  const { publicId = "" } = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<PanelMode>("view");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");

  // Athlete and trainings fetches — independent, run in parallel.
  const athleteState = useApi((signal) => getAthlete(publicId, signal), [publicId]);
  const trainingsState = useApi((signal) => getTrainings(signal), []);

  const athlete = athleteState.data;
  const trainings = trainingsState.data;

  // Upcoming = today or later, sorted ascending.
  const athleteTrainings = useMemo(() => {
    if (!trainings) return [];
    const now = Date.now();
    return trainings
      .filter((t) => new Date(t.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trainings]);

  // ── PATCH mutation ────────────────────────────────────────────────────────
  const {
    mutate: doUpdate,
    isLoading: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useMutation(
    (data: AthleteCreateInput) => patchAthlete(publicId, data),
    {
      onSuccess: () => {
        athleteState.data; // trigger visual refresh via re-fetch below
        setMode("view");
        setToastVariant("success");
        setToastMessage("Athlete updated successfully.");
        // Re-trigger fetch by reloading the page state — simplest approach
        // without a dedicated refetch mechanism.
        window.location.reload();
      },
      onError: () => {
        setToastVariant("error");
        setToastMessage("Failed to update athlete. Please try again.");
      },
    },
  );

  // ── DELETE mutation ───────────────────────────────────────────────────────
  const {
    mutate: doDelete,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation(
    () => deleteAthlete(publicId),
    {
      onSuccess: () => {
        navigate("/athletes", {
          state: { toast: `${athlete?.first_name} ${athlete?.last_name} was deleted.` },
        });
      },
      onError: () => {
        setMode("view");
        setToastVariant("error");
        setToastMessage("Failed to delete athlete. Please try again.");
      },
    },
  );

  const clearToast = useCallback(() => setToastMessage(""), []);

  const handleEditCancel = () => {
    setMode("view");
    resetUpdate();
  };

  // ── Early returns ─────────────────────────────────────────────────────────
  if (athleteState.isLoading) return <Spinner label="Loading athlete profile…" />;
  if (athleteState.error) return <ErrorState message={athleteState.error} />;
  if (!athlete)
    return <ErrorState title="Athlete not found" message="The requested athlete does not exist." />;

  const fullName = `${athlete.first_name} ${athlete.last_name}`.trim();

  return (
    <section className="stack" aria-label="Athlete profile">
      <Toast message={toastMessage} variant={toastVariant} onClose={clearToast} />

      <p>
        <Link to="/athletes">&larr; Back to athletes</Link>
      </p>

      {/* Profile card */}
      <article className="card stack">
        <header className="card-header-row">
          <div className="stack">
            <h2>{fullName}</h2>
            {athlete.jersey_number !== null && (
              <p>
                <strong>Jersey number:</strong>{" "}
                <span className="pill">#{athlete.jersey_number}</span>
              </p>
            )}
          </div>
          {mode === "view" && (
            <div className="action-row">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setMode("edit")}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => setMode("confirm-delete")}
              >
                🗑 Delete
              </button>
            </div>
          )}
        </header>

        {/* View mode — detail grid */}
        {mode === "view" && (
          <dl className="detail-grid">
            <div>
              <dt>Email</dt>
              <dd>{athlete.email || "—"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{athlete.phone || "—"}</dd>
            </div>
            <div>
              <dt>Date of birth</dt>
              <dd>{athlete.date_of_birth ? formatDate(athlete.date_of_birth) : "—"}</dd>
            </div>
            <div>
              <dt>Height</dt>
              <dd>{athlete.height ? `${athlete.height} cm` : "—"}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{athlete.weight ? `${athlete.weight} kg` : "—"}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{athlete.address?.formatted_address ?? "—"}</dd>
            </div>
          </dl>
        )}

        {/* Edit mode — inline AthleteForm */}
        {mode === "edit" && (
          <AthleteForm
            initialValues={{
              first_name: athlete.first_name,
              last_name: athlete.last_name,
              email: athlete.email,
              phone: athlete.phone,
              date_of_birth: athlete.date_of_birth,
              height: athlete.height,
              weight: athlete.weight,
              jersey_number: athlete.jersey_number,
            }}
            isLoading={isUpdating}
            serverError={updateError}
            onSubmit={doUpdate}
            onCancel={handleEditCancel}
            submitLabel="Update athlete"
          />
        )}

        {/* Delete confirm */}
        {mode === "confirm-delete" && (
          <ConfirmDialog
            message={`Are you sure you want to permanently delete ${fullName}? This cannot be undone.`}
            isLoading={isDeleting}
            onConfirm={() => doDelete(undefined as unknown as never)}
            onCancel={() => setMode("view")}
          />
        )}

        {deleteError && mode === "view" && (
          <p className="form-error" role="alert">
            {deleteError}
          </p>
        )}
      </article>

      {/* Upcoming trainings */}
      <article className="card stack">
        <h3>Upcoming training sessions</h3>
        {trainingsState.isLoading ? <Spinner label="Loading training sessions…" /> : null}
        {trainingsState.error ? <ErrorState message={trainingsState.error} /> : null}
        {!trainingsState.isLoading && !trainingsState.error ? (
          <TrainingList
            trainings={athleteTrainings}
            emptyMessage="No upcoming training sessions in the schedule."
          />
        ) : null}
      </article>
    </section>
  );
}

export default AthleteDetailPage;
