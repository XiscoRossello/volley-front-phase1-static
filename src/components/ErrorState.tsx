// Shared error card. Pages render this whenever useApi() returns an error,
// which typically means the Docker backend is not running or a 4xx/5xx came
// back from the API.

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    // role="alert" asks assistive tech to interrupt and read the message out.
    <section className="card stack error-state" role="alert">
      <h3>{title}</h3>
      <p>{message}</p>
      {/* Retry button is optional: not every page has a cheap way to retry
          (e.g. detail pages tied to a route param). */}
      {onRetry ? (
        <button type="button" className="btn-outline" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </section>
  );
}

export default ErrorState;
