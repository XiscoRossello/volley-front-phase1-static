// Catch-all route. Rendered for any URL that does not match a real page so
// users get a friendly message instead of a blank screen.

import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="card stack" aria-label="Page not found">
      <h2>Page not found</h2>
      <p>The requested route does not exist in this phase.</p>
      <p>
        <Link className="btn-outline" to="/">
          Return to home
        </Link>
      </p>
    </section>
  );
}

export default NotFoundPage;
