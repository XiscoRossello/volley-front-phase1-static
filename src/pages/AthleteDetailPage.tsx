// Story 4 — athlete profile with upcoming training sessions.
// Two independent fetches run in parallel: one for the athlete detail and one
// for the trainings list (filtered client-side to "upcoming").

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import Spinner from "../components/Spinner";
import TrainingList from "../components/TrainingList";
import { getAthlete, getTrainings } from "../api/endpoints";
import { useApi } from "../hooks/useApi";
import { formatDate } from "../utils/date";

function AthleteDetailPage() {
  // `publicId` comes from the URL (/athletes/:publicId). Defaulting to ""
  // avoids a narrower "string | undefined" type downstream.
  const { publicId = "" } = useParams();

  // Athlete is tied to the route param → re-fetches on navigation.
  // Trainings are global → fetched once for the entire session.
  const athleteState = useApi((signal) => getAthlete(publicId, signal), [publicId]);
  const trainingsState = useApi((signal) => getTrainings(signal), []);

  const athlete = athleteState.data;
  const trainings = trainingsState.data;

  // Upcoming = today or later, sorted ascending. We do it on the client
  // because the API has no "from=now" query param yet.
  const athleteTrainings = useMemo(() => {
    if (!trainings) {
      return [];
    }
    const now = Date.now();
    return trainings
      .filter((training) => new Date(training.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trainings]);

  // Early returns for the athlete fetch — the rest of the page is meaningless
  // without the profile, so we never render it in those states.
  if (athleteState.isLoading) {
    return <Spinner label="Loading athlete profile..." />;
  }

  if (athleteState.error) {
    return <ErrorState message={athleteState.error} />;
  }

  if (!athlete) {
    return <ErrorState title="Athlete not found" message="The requested athlete does not exist." />;
  }

  const fullName = `${athlete.first_name} ${athlete.last_name}`.trim();

  return (
    <section className="stack" aria-label="Athlete profile">
      <p>
        <Link to="/athletes">&larr; Back to athletes</Link>
      </p>

      <article className="card stack">
        <header className="stack">
          <h2>{fullName}</h2>
          {athlete.jersey_number !== null ? (
            <p>
              <strong>Jersey number:</strong> <span className="pill">#{athlete.jersey_number}</span>
            </p>
          ) : null}
        </header>

        {/* Using a dl keeps the label/value pairing semantic; CSS grid lays
            the pairs into a responsive two-column layout. */}
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
      </article>

      <article className="card stack">
        <h3>Upcoming training sessions</h3>
        {/* Trainings section has its own loading / error state independent
            from the athlete fetch, so the profile above can render first. */}
        {trainingsState.isLoading ? <Spinner label="Loading training sessions..." /> : null}
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
