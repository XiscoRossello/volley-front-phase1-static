// Stateless grid of AthleteCard. The parent is responsible for filtering the
// input array, so the empty state is shown when the search produces no hits.

import { AthleteListItem } from "../types";
import AthleteCard from "./AthleteCard";

interface AthleteListProps {
  athletes: AthleteListItem[];
  shortlist: string[];
  onToggleShortlist: (publicId: string) => void;
}

function AthleteList({ athletes, shortlist, onToggleShortlist }: AthleteListProps) {
  if (athletes.length === 0) {
    return (
      <section className="card">
        <h3>No athletes match the current search.</h3>
        <p>Try a different name to continue the shortlist workflow.</p>
      </section>
    );
  }

  return (
    <section className="grid cols-2" aria-label="Athlete list">
      {athletes.map((athlete) => (
        <AthleteCard
          key={athlete.public_id}
          athlete={athlete}
          // Membership check happens here so AthleteCard only needs a boolean.
          isShortlisted={shortlist.includes(athlete.public_id)}
          onToggleShortlist={onToggleShortlist}
        />
      ))}
    </section>
  );
}

export default AthleteList;
