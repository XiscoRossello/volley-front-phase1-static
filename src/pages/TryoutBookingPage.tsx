// Thin wrapper — keeps routing uniform (every route points to a page, not a
// component). All the real logic lives in TryoutBookingForm.

import TryoutBookingForm from "../components/TryoutBookingForm";

function TryoutBookingPage() {
  return (
    <section className="stack" aria-label="Tryout booking workflow">
      <TryoutBookingForm />
    </section>
  );
}

export default TryoutBookingPage;
