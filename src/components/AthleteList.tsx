import { Athlete } from "../types";
import AthleteCard from "./AthleteCard";

interface AthleteListProps {
  athletes: Athlete[];
  shortlist: number[];
  onToggleShortlist: (athleteId: number) => void;
}

function AthleteList({ athletes, shortlist, onToggleShortlist }: AthleteListProps) {
  if (athletes.length === 0) {
    return (
      <section className="card">
        <h3>No athletes match the selected filter.</h3>
        <p>Try a different discipline to continue the workflow.</p>
      </section>
    );
  }

  return (
    <section className="grid cols-2" aria-label="Athlete list">
      {athletes.map((athlete) => (
        <AthleteCard
          key={athlete.id}
          athlete={athlete}
          isShortlisted={shortlist.includes(athlete.id)}
          onToggleShortlist={onToggleShortlist}
        />
      ))}
    </section>
  );
}

export default AthleteList;
