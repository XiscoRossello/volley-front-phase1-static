import { Athlete } from "../types";

interface AthleteCardProps {
  athlete: Athlete;
  isShortlisted: boolean;
  onToggleShortlist: (athleteId: number) => void;
}

function AthleteCard({ athlete, isShortlisted, onToggleShortlist }: AthleteCardProps) {
  return (
    <article className="card stack">
      <header className="stack">
        <h3>{athlete.fullName}</h3>
        <p>
          {athlete.discipline} · {athlete.level}
        </p>
      </header>

      <p>
        <strong>Age:</strong> {athlete.age}
      </p>
      <p>
        <strong>City:</strong> {athlete.city}
      </p>
      <p>
        <strong>Status:</strong> <span className="pill">{athlete.status}</span>
      </p>

      <button type="button" className={isShortlisted ? "btn-outline" : "btn-primary"} onClick={() => onToggleShortlist(athlete.id)}>
        {isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
      </button>
    </article>
  );
}

export default AthleteCard;
