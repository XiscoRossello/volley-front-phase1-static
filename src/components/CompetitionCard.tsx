// Single competition tile. Purely presentational: all data comes in via props
// so it can be unit tested without touching the API.

import { Link } from "react-router-dom";
import { CompetitionListItem } from "../types";
import { formatDateTime } from "../utils/date";

interface CompetitionCardProps {
  competition: CompetitionListItem;
}

function CompetitionCard({ competition }: CompetitionCardProps) {
  return (
    <article className="card stack">
      <header className="stack">
        <h3>{competition.name}</h3>
        <p>
          <strong>Season:</strong> {competition.season.name}
        </p>
        <p>
          <strong>When:</strong> {formatDateTime(competition.date)}
        </p>
      </header>
      {/* The detail link uses the competition's public_id, which the router
          picks up as a URL param on CompetitionDetailPage. */}
      <Link className="btn-outline" to={`/competitions/${competition.public_id}`}>
        View details
      </Link>
    </article>
  );
}

export default CompetitionCard;
