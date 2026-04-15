// Thin wrapper around CoachDirectory. CoachDirectory owns its own fetch, so
// the page only provides the outer <section> and accessibility label.

import CoachDirectory from "../components/CoachDirectory";

function CoachesPage() {
  return (
    <section className="stack" aria-label="Coaches support view">
      <CoachDirectory />
    </section>
  );
}

export default CoachesPage;
