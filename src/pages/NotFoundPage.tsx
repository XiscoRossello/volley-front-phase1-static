import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="card stack" aria-label="Page not found">
      <h2>Page not found</h2>
      <p>The requested route does not exist in this static phase.</p>
      <p>
        <Link className="btn-outline" to="/">
          Return to home
        </Link>
      </p>
    </section>
  );
}

export default NotFoundPage;
