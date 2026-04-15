// Dumb list wrapper around CompetitionCard.
// Keeping this as its own component lets us swap the grid layout or inject an
// empty state without touching the page that owns the data.

import { CompetitionListItem } from "../types";
import CompetitionCard from "./CompetitionCard";

interface CompetitionListProps {
  competitions: CompetitionListItem[];
}

function CompetitionList({ competitions }: CompetitionListProps) {
  // Empty state — the page already filtered by season, so reaching zero items
  // is a legitimate outcome and we explain it instead of showing a blank grid.
  if (competitions.length === 0) {
    return (
      <section className="card">
        <h3>No competitions scheduled yet.</h3>
        <p>Come back later or seed the backend database with sample fixtures.</p>
      </section>
    );
  }

  return (
    <section className="grid cols-2" aria-label="Competition list">
      {competitions.map((competition) => (
        <CompetitionCard key={competition.public_id} competition={competition} />
      ))}
    </section>
  );
}

export default CompetitionList;
