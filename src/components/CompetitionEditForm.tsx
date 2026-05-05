// Controlled form for editing a competition's score and roster (PATCH).
// Disciplines and medal types match the backend CompetitionScore schema exactly.
// The caller owns the mutation via onSubmit; this component is pure UI.

import { useState, useEffect } from "react";
import { Competition, Discipline, MedalCount, CompetitionPatchInput } from "../types";
import { AthleteListItem, CoachListItem } from "../types";

const DISCIPLINES: { key: Discipline; label: string }[] = [
  { key: "sprints", label: "Sprints" },
  { key: "long_distance", label: "Long distance" },
  { key: "relays", label: "Relays" },
  { key: "high_jump", label: "High jump" },
  { key: "long_jump", label: "Long jump" },
];

type ScoreState = Record<Discipline, { gold: string; silver: string; bronze: string }>;

function buildInitialScore(competition: Competition): ScoreState {
  const state = {} as ScoreState;
  for (const { key } of DISCIPLINES) {
    const existing = competition.score?.results?.[key];
    state[key] = {
      gold: existing?.gold != null ? String(existing.gold) : "",
      silver: existing?.silver != null ? String(existing.silver) : "",
      bronze: existing?.bronze != null ? String(existing.bronze) : "",
    };
  }
  return state;
}

interface CompetitionEditFormProps {
  competition: Competition;
  athletes: AthleteListItem[];
  coaches: CoachListItem[];
  isLoading: boolean;
  serverError: string | null;
  onSubmit: (patch: CompetitionPatchInput) => void;
  onCancel: () => void;
}

function CompetitionEditForm({
  competition,
  athletes,
  coaches,
  isLoading,
  serverError,
  onSubmit,
  onCancel,
}: CompetitionEditFormProps) {
  const [score, setScore] = useState<ScoreState>(() => buildInitialScore(competition));
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>(
    () => competition.athletes.map((a) => a.public_id),
  );
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>(
    () => competition.coaches.map((c) => c.public_id),
  );

  // Re-seed form if the competition changes (e.g. after a successful PATCH).
  useEffect(() => {
    setScore(buildInitialScore(competition));
    setSelectedAthletes(competition.athletes.map((a) => a.public_id));
    setSelectedCoaches(competition.coaches.map((c) => c.public_id));
  }, [competition]);

  const handleMedalChange = (
    discipline: Discipline,
    medal: keyof MedalCount,
    value: string,
  ) => {
    setScore((prev) => ({
      ...prev,
      [discipline]: { ...prev[discipline], [medal]: value },
    }));
  };

  const toggleMultiSelect = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    id: string,
  ) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Build the score results — only include disciplines where at least one
    // medal count has been entered.
    const results: CompetitionPatchInput["score"] = { results: {} };
    for (const { key } of DISCIPLINES) {
      const { gold, silver, bronze } = score[key];
      if (gold !== "" || silver !== "" || bronze !== "") {
        results!.results![key] = {
          gold: parseInt(gold || "0", 10),
          silver: parseInt(silver || "0", 10),
          bronze: parseInt(bronze || "0", 10),
        };
      }
    }

    const patch: CompetitionPatchInput = {
      score: Object.keys(results!.results!).length > 0 ? results : null,
      athlete_public_ids: selectedAthletes,
      coach_public_ids: selectedCoaches,
    };

    onSubmit(patch);
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      {/* Score section */}
      <section aria-label="Competition score">
        <h4 className="form-section-title">Score (medal counts by discipline)</h4>
        <div className="score-grid">
          <div className="score-grid__header">
            <span>Discipline</span>
            <span>🥇 Gold</span>
            <span>🥈 Silver</span>
            <span>🥉 Bronze</span>
          </div>
          {DISCIPLINES.map(({ key, label }) => (
            <div key={key} className="score-grid__row">
              <span className="score-grid__label">{label}</span>
              {(["gold", "silver", "bronze"] as const).map((medal) => (
                <input
                  key={medal}
                  id={`cef-${key}-${medal}`}
                  type="number"
                  min="0"
                  step="1"
                  value={score[key][medal]}
                  onChange={(e) => handleMedalChange(key, medal, e.target.value)}
                  aria-label={`${label} ${medal}`}
                  className="score-input"
                  placeholder="0"
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Athlete roster */}
      <section aria-label="Athlete roster">
        <h4 className="form-section-title">Athletes attending</h4>
        <div className="checklist">
          {athletes.length === 0 && <p className="muted">No athletes available.</p>}
          {athletes.map((a) => (
            <label key={a.public_id} className="checklist__item">
              <input
                type="checkbox"
                checked={selectedAthletes.includes(a.public_id)}
                onChange={() => toggleMultiSelect(setSelectedAthletes, a.public_id)}
              />
              {a.first_name} {a.last_name}
              {a.jersey_number != null && (
                <span className="pill">#{a.jersey_number}</span>
              )}
            </label>
          ))}
        </div>
      </section>

      {/* Coach roster */}
      <section aria-label="Coach roster">
        <h4 className="form-section-title">Coaches attending</h4>
        <div className="checklist">
          {coaches.length === 0 && <p className="muted">No coaches available.</p>}
          {coaches.map((c) => (
            <label key={c.public_id} className="checklist__item">
              <input
                type="checkbox"
                checked={selectedCoaches.includes(c.public_id)}
                onChange={() => toggleMultiSelect(setSelectedCoaches, c.public_id)}
              />
              {c.first_name} {c.last_name}
              {c.certification && (
                <span className="pill">{c.certification}</span>
              )}
            </label>
          ))}
        </div>
      </section>

      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="action-row">
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CompetitionEditForm;
