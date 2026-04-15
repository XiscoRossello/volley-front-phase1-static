// Story 3 — competition detail.
// The competition detail carries a VenueRef (public_id + name). To show the
// full venue info (capacity, address...) we issue a secondary GET once we
// know which venue to load.

import { Link, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import Spinner from "../components/Spinner";
import { getCompetition, getVenue } from "../api/endpoints";
import { useApi } from "../hooks/useApi";
import { formatDateTime } from "../utils/date";

function CompetitionDetailPage() {
  const { publicId = "" } = useParams();

  // First fetch — the competition itself.
  const competitionState = useApi((signal) => getCompetition(publicId, signal), [publicId]);

  // Second fetch — depends on the competition's venue_public_id. While the
  // competition is loading, venuePublicId is null and the loader resolves
  // to null immediately, effectively acting as a no-op.
  const venuePublicId = competitionState.data?.venue?.public_id ?? null;
  const venueState = useApi(
    (signal) => (venuePublicId ? getVenue(venuePublicId, signal) : Promise.resolve(null)),
    [venuePublicId],
  );

  if (competitionState.isLoading) {
    return <Spinner label="Loading competition..." />;
  }

  if (competitionState.error) {
    return <ErrorState message={competitionState.error} />;
  }

  const competition = competitionState.data;
  if (!competition) {
    return (
      <ErrorState
        title="Competition not found"
        message="The requested competition does not exist."
      />
    );
  }

  const venue = venueState.data;

  return (
    <section className="stack" aria-label="Competition detail">
      <p>
        <Link to="/competitions">&larr; Back to competitions</Link>
      </p>

      <article className="card stack">
        <header className="stack">
          <h2>{competition.name}</h2>
          <p>
            <strong>Season:</strong> {competition.season.name}
          </p>
          <p>
            <strong>When:</strong> {formatDateTime(competition.date)}
          </p>
        </header>
      </article>

      <article className="card stack">
        <h3>Venue</h3>
        {/* Three possible states for the venue section:
            - no venue assigned → static message
            - venue loading → spinner (only while the second fetch is alive)
            - venue error → ErrorState scoped to this card */}
        {!competition.venue ? <p>No venue assigned yet.</p> : null}
        {competition.venue && venueState.isLoading ? <Spinner label="Loading venue..." /> : null}
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

      <article className="card stack">
        <h3>Line-up</h3>
        <p>
          <strong>Coaches:</strong>{" "}
          {/* Fall back to TBD when the line-up has not been announced yet. */}
          {competition.coaches.length === 0
            ? "TBD"
            : competition.coaches.map((coach) => coach.display_name).join(", ")}
        </p>
        <p>
          <strong>Athletes:</strong>{" "}
          {competition.athletes.length === 0 ? (
            "TBD"
          ) : (
            <span>
              {/* Each athlete is a link back to its own detail page — this is
                  where stories 3 and 4 meet. */}
              {competition.athletes.map((athlete, index) => (
                <span key={athlete.public_id}>
                  {index > 0 ? ", " : ""}
                  <Link to={`/athletes/${athlete.public_id}`}>{athlete.display_name}</Link>
                </span>
              ))}
            </span>
          )}
        </p>
      </article>
    </section>
  );
}

export default CompetitionDetailPage;
