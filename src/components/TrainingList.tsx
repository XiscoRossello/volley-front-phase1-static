// Compact training sessions list used inside athlete profiles.
// The parent component decides what "upcoming" means and passes a pre-filtered
// array, so this component stays purely about rendering.

import { TrainingListItem } from "../types";
import { formatDateTime } from "../utils/date";

interface TrainingListProps {
  trainings: TrainingListItem[];
  emptyMessage?: string;
}

function TrainingList({ trainings, emptyMessage = "No training sessions scheduled." }: TrainingListProps) {
  // We let the caller override the empty message because "no upcoming
  // sessions" reads differently than "no sessions at all".
  if (trainings.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <ul className="training-list">
      {trainings.map((training) => (
        <li key={training.public_id} className="training-list-item">
          <strong>{training.name}</strong>
          <span className="training-meta">{formatDateTime(training.date)}</span>
          {/* Focus is optional on the backend — skip rendering when blank. */}
          {training.focus ? <span className="training-meta">Focus: {training.focus}</span> : null}
          <span className="training-meta">Season: {training.season.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default TrainingList;
