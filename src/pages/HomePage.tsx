function HomePage() {
  return (
    <section className="stack" aria-label="Landing summary">
      <article className="hero stack">
        <h1>Static React Delivery · Athletics Sports Club</h1>
        <p>
          This prototype turns wire-frames into a functional static app using Vite, reusable components, React Router,
          and local state from JSON mock data.
        </p>
      </article>

      <section className="grid cols-2">
        <article className="card stack">
          <h2>User Story 1</h2>
          <p>
            As a prospective athlete, I want to reserve a tryout slot so that I can start the club selection process.
          </p>
          <p>Go to Tryout Booking to validate the full flow, including error and cancellation states.</p>
        </article>

        <article className="card stack">
          <h2>User Story 2</h2>
          <p>
            As a coach, I want to filter and shortlist athlete candidates so that I can prepare final evaluations.
          </p>
          <p>Go to Athletes to filter by discipline and manage the shortlist locally.</p>
        </article>
      </section>
    </section>
  );
}

export default HomePage;
