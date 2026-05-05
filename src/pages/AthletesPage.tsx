// Story 2 — browse and shortlist athletes.
// Phase 3 adds a "Register new athlete" CTA and shows a toast if the user
// arrives here after deleting or creating an athlete (router-state message).

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AthleteList from "../components/AthleteList";
import ErrorState from "../components/ErrorState";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import { getAthletes } from "../api/endpoints";
import { useApi } from "../hooks/useApi";

function AthletesPage() {
  const { state } = useLocation();

  // Show a toast if navigated here with a success message in router state
  // (e.g. after a successful DELETE from AthleteDetailPage).
  const [toastMessage, setToastMessage] = useState<string>(
    (state as { toast?: string } | null)?.toast ?? "",
  );
  const clearToast = useCallback(() => setToastMessage(""), []);

  // Single fetch on mount — the dependency array is empty because the list
  // does not depend on any route param or filter server-side.
  const { data, isLoading, error } = useApi((signal) => getAthletes(signal), []);
  const [search, setSearch] = useState<string>("");
  const [shortlist, setShortlist] = useState<string[]>([]);

  // Filtering is client-side because the API does not expose a search param.
  const filteredAthletes = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((a) =>
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(term),
    );
  }, [data, search]);

  const handleToggleShortlist = (publicId: string) => {
    setShortlist((current) =>
      current.includes(publicId)
        ? current.filter((id) => id !== publicId)
        : [...current, publicId],
    );
  };

  return (
    <section className="stack" aria-label="Athletes workflow">
      <Toast message={toastMessage} variant="success" onClose={clearToast} />

      <article className="card stack">
        <header className="card-header-row">
          <div className="stack">
            <h2>User Story 2: Filter and shortlist athletes</h2>
            <p>
              As a coach, I want to filter and shortlist athlete candidates so that I can
              prepare final evaluations.
            </p>
          </div>
          <Link to="/athletes/new" className="btn-primary">
            + Register athlete
          </Link>
        </header>

        <label className="field" htmlFor="athleteSearch">
          Search athlete by name
          <input
            id="athleteSearch"
            type="search"
            value={search}
            placeholder="Type a first or last name…"
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <p>
          Shortlist count: <strong>{shortlist.length}</strong>
        </p>
      </article>

      {isLoading ? <Spinner label="Loading athletes from the API…" /> : null}
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
