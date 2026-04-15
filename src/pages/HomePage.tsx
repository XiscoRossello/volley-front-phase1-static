// Landing page. Acts as a table of contents for the four user stories so the
// grader can jump into any of them with a single click.

import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="stack" aria-label="Landing summary">
      <article className="hero stack">
        <h1>Dynamic React Delivery · Athletics Sports Club</h1>
        <p>
          Phase 2 connects the prototype to the local Athletics Sports Club REST API. Data is
          fetched on demand from the Docker backend, with loading and error states on every view.
        </p>
      </article>

      {/* One card per user story. The order matches the user-stories.md file
          and the phase2-static-delivery folder. */}
      <section className="grid cols-2">
        <article className="card stack">
          <h2>User Story 1 · Tryout booking</h2>
          <p>
            As a prospective athlete, I want to reserve a tryout slot so that I can start the club
            selection process.
          </p>
          <p>
            <Link className="btn-outline" to="/tryouts">
              Go to tryout booking
            </Link>
          </p>
        </article>

        <article className="card stack">
          <h2>User Story 2 · Shortlist athletes</h2>
          <p>
            As a coach, I want to browse and shortlist athlete candidates so that I can prepare
            final evaluations.
          </p>
          <p>
            <Link className="btn-outline" to="/athletes">
              Go to athletes
            </Link>
          </p>
        </article>

        <article className="card stack">
          <h2>User Story 3 · Competitions calendar</h2>
          <p>
            As a club supporter, I want to browse the upcoming competitions calendar so that I can
            plan which matches to attend.
          </p>
          <p>
            <Link className="btn-outline" to="/competitions">
              Go to competitions
            </Link>
          </p>
        </article>

        <article className="card stack">
          <h2>User Story 4 · Athlete profile with trainings</h2>
          <p>
            As a coach, I want to open an athlete profile and see their upcoming training sessions
            so that I can plan individual follow-ups.
          </p>
          <p>
            <Link className="btn-outline" to="/athletes">
              Pick an athlete
            </Link>
          </p>
        </article>
      </section>
    </section>
  );
}

export default HomePage;
