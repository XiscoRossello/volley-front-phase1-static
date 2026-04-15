// Coaches support view (story 2 companion). Fetches its own data because the
// page hosting it has no other responsibilities to coordinate.

import ErrorState from "./ErrorState";
import Spinner from "./Spinner";
import { getCoaches } from "../api/endpoints";
import { useApi } from "../hooks/useApi";

function CoachDirectory() {
  const { data, isLoading, error } = useApi((signal) => getCoaches(signal), []);

  // Early returns keep the happy path tidy and mirror the loading / error /
  // data branches of useApi().
  if (isLoading) {
    return <Spinner label="Loading coaches from the API..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const coaches = data ?? [];

  if (coaches.length === 0) {
    return (
      <section className="card">
        <h3>No coaches registered yet.</h3>
      </section>
    );
  }

  return (
    <section className="stack" aria-label="Coach directory">
      <h2>Coach Directory</h2>
      <div className="grid cols-2">
        {coaches.map((coach) => (
          <article className="card stack" key={coach.public_id}>
            <h3>
              {coach.first_name} {coach.last_name}
            </h3>
            <p>
              <strong>Certification:</strong>{" "}
              {/* Certification is optional so we fall back to "None" rather
                  than leaking a raw null to the UI. */}
              <span className="pill">{coach.certification ?? "None"}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CoachDirectory;
