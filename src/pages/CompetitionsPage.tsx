// Story 3 — competitions calendar.
// One fetch on mount; season filter and ordering are derived client-side.

import { useMemo, useState } from "react";
import CompetitionList from "../components/CompetitionList";
import ErrorState from "../components/ErrorState";
import Spinner from "../components/Spinner";
import { getCompetitions } from "../api/endpoints";
import { useApi } from "../hooks/useApi";

function CompetitionsPage() {
  const { data, isLoading, error } = useApi((signal) => getCompetitions(signal), []);
  const [seasonFilter, setSeasonFilter] = useState<string>("All");

  // The season dropdown is built from whatever seasons the API returned, so
  // the list auto-updates whenever the backend data changes.
  const seasons = useMemo(() => {
    if (!data) {
      return ["All"];
    }
    const names = new Set(data.map((competition) => competition.season.name));
    return ["All", ...names];
  }, [data]);

  // Sort first, then filter. Sorting on the full list keeps results stable
  // when the user switches between seasons.
  const filteredCompetitions = useMemo(() => {
    if (!data) {
      return [];
    }
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    if (seasonFilter === "All") {
      return sorted;
    }
    return sorted.filter((competition) => competition.season.name === seasonFilter);
  }, [data, seasonFilter]);

  return (
    <section className="stack" aria-label="Competitions calendar">
      <article className="card stack">
        <h2>User Story 3: Browse the competitions calendar</h2>
        <p>
          As a club supporter, I want to browse the upcoming competitions calendar so that I can
          plan which matches to attend.
        </p>

        <label className="field" htmlFor="seasonFilter">
          Filter by season
          <select
            id="seasonFilter"
            value={seasonFilter}
            onChange={(event) => setSeasonFilter(event.target.value)}
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </label>
      </article>

      {isLoading ? <Spinner label="Loading competitions from the API..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error ? <CompetitionList competitions={filteredCompetitions} /> : null}
    </section>
  );
}

export default CompetitionsPage;
