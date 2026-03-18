import { useMemo, useState } from "react";
import athletesData from "../data/athletes.json";
import { Athlete } from "../types";
import AthleteList from "../components/AthleteList";

function AthletesPage() {
  const [athletes] = useState<Athlete[]>(athletesData);
  const [disciplineFilter, setDisciplineFilter] = useState<string>("All");
  const [shortlist, setShortlist] = useState<number[]>([]);

  const disciplines = useMemo(() => {
    const values = new Set(athletes.map((athlete) => athlete.discipline));
    return ["All", ...values, "Swimming"];
  }, [athletes]);

  const filteredAthletes = useMemo(() => {
    if (disciplineFilter === "All") {
      return athletes;
    }

    return athletes.filter((athlete) => athlete.discipline === disciplineFilter);
  }, [athletes, disciplineFilter]);

  const handleToggleShortlist = (athleteId: number) => {
    setShortlist((current) =>
      current.includes(athleteId) ? current.filter((id) => id !== athleteId) : [...current, athleteId],
    );
  };

  return (
    <section className="stack" aria-label="Athletes workflow">
      <article className="card stack">
        <h2>User Story 2: Filter and shortlist athletes</h2>
        <p>
          As a coach, I want to filter and shortlist athlete candidates so that I can prepare final evaluations.
        </p>

        <label className="field" htmlFor="disciplineFilter">
          Filter by discipline
          <select
            id="disciplineFilter"
            value={disciplineFilter}
            onChange={(event) => setDisciplineFilter(event.target.value)}
          >
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </label>

        <p>
          Shortlist count: <strong>{shortlist.length}</strong>
        </p>
      </article>

      <AthleteList athletes={filteredAthletes} shortlist={shortlist} onToggleShortlist={handleToggleShortlist} />
    </section>
  );
}

export default AthletesPage;
