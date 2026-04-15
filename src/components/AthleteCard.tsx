// Athlete tile used on the athletes page. Shortlist membership is owned by
// the parent, so this component receives both the flag and the toggle callback.

import { Link } from "react-router-dom";
import { AthleteListItem } from "../types";

interface AthleteCardProps {
  athlete: AthleteListItem;
  isShortlisted: boolean;
  onToggleShortlist: (publicId: string) => void;
}

function AthleteCard({ athlete, isShortlisted, onToggleShortlist }: AthleteCardProps) {
  // Backend stores first/last separately — we join them once at render time.
  const fullName = `${athlete.first_name} ${athlete.last_name}`.trim();

  return (
    <article className="card stack">
      <header className="stack">
        <h3>{fullName}</h3>
        {/* Jersey number is optional, so we branch between two messages
            instead of rendering an empty pill. */}
        {athlete.jersey_number !== null ? (
          <p>
            <strong>Jersey number:</strong> <span className="pill">#{athlete.jersey_number}</span>
          </p>
        ) : (
          <p>No jersey number assigned.</p>
        )}
      </header>

      <div className="action-row">
        {/* Profile link uses the athlete's public_id, which AthleteDetailPage
            reads via useParams(). */}
        <Link className="btn-outline" to={`/athletes/${athlete.public_id}`}>
          View profile
        </Link>
        {/* Button style flips based on shortlist membership so the action the
            user would take next is always the visually prominent one. */}
        <button
          type="button"
          className={isShortlisted ? "btn-outline" : "btn-primary"}
          onClick={() => onToggleShortlist(athlete.public_id)}
        >
          {isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
        </button>
      </div>
    </article>
  );
}

export default AthleteCard;
