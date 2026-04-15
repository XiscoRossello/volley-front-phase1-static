// Story 2 — browse and shortlist athletes.
// The page owns the data fetch, the search term and the shortlist. Children
// (AthleteList, AthleteCard) stay presentational.

import { useMemo, useState } from "react";
import AthleteList from "../components/AthleteList";
import ErrorState from "../components/ErrorState";
import Spinner from "../components/Spinner";
import { getAthletes } from "../api/endpoints";
import { useApi } from "../hooks/useApi";

function AthletesPage() {
  // Single fetch on mount — the dependency array is empty because the list
  // does not depend on any route param or filter server-side.
  const { data, isLoading, error } = useApi((signal) => getAthletes(signal), []);
  const [search, setSearch] = useState<string>("");
  const [shortlist, setShortlist] = useState<string[]>([]);

  // Filtering is client-side because the API does not expose a search param.
  // Recomputing via useMemo keeps the input responsive on large lists.
  const filteredAthletes = useMemo(() => {
    if (!data) {
      return [];
    }
    const term = search.trim().toLowerCase();
    if (term.length === 0) {
      return data;
    }
    return data.filter((athlete) => {
      const haystack = `${athlete.first_name} ${athlete.last_name}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [data, search]);

  // Toggle semantics: same action adds or removes depending on current state,
  // which also drives the card button label through AthleteCard.
  const handleToggleShortlist = (publicId: string) => {
    setShortlist((current) =>
      current.includes(publicId)
        ? current.filter((id) => id !== publicId)
        : [...current, publicId],
    );
  };

  return (
    <section className="stack" aria-label="Athletes workflow">
      <article className="card stack">
        <h2>User Story 2: Filter and shortlist athletes</h2>
        <p>
          As a coach, I want to filter and shortlist athlete candidates so that I can prepare final
          evaluations.
        </p>

        <label className="field" htmlFor="athleteSearch">
          Search athlete by name
          <input
            id="athleteSearch"
            type="search"
            value={search}
            placeholder="Type a first or last name..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <p>
          Shortlist count: <strong>{shortlist.length}</strong>
        </p>
      </article>

      {/* Loading / error / data render paths — mutually exclusive. */}
      {isLoading ? <Spinner label="Loading athletes from the API..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error ? (
        <AthleteList
          athletes={filteredAthletes}
          shortlist={shortlist}
          onToggleShortlist={handleToggleShortlist}
        />
      ) : null}
    </section>
  );
}

export default AthletesPage;
