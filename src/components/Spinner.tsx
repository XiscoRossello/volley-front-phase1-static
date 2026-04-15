// Shared loading indicator. Every page that waits on the API renders this
// while useApi() reports isLoading, so the visual language stays consistent.

interface SpinnerProps {
  label?: string;
}

function Spinner({ label = "Loading..." }: SpinnerProps) {
  return (
    // role="status" + aria-live make the spinner announce itself to screen
    // readers when the label changes.
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner-ring" aria-hidden="true" />
      <span className="spinner-text">{label}</span>
    </div>
  );
}

export default Spinner;
