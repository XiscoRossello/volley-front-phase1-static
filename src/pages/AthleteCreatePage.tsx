// Story 5 — Create a new athlete.
// A simple create-mode wrapper around AthleteForm.
// On success → redirects to /athletes with a toast message passed via router state.

import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AthleteForm from "../components/AthleteForm";
import { createAthlete } from "../api/endpoints";
import { useMutation } from "../hooks/useMutation";
import { AthleteCreateInput } from "../types";

function AthleteCreatePage() {
  const navigate = useNavigate();

  const { mutate, isLoading, error } = useMutation(
    (data: AthleteCreateInput) => createAthlete(data),
    {
      onSuccess: (result) => {
        // Navigate to the new athlete's detail page with a success toast.
        const newId = result?.public_id;
        const target = newId ? `/athletes/${newId}` : "/athletes";
        navigate(target, {
          state: { toast: "New athlete created successfully." },
        });
      },
    },
  );

  const handleCancel = useCallback(() => {
    navigate("/athletes");
  }, [navigate]);

  return (
    <section className="stack" aria-label="Create athlete">
      <p>
        <Link to="/athletes">&larr; Back to athletes</Link>
      </p>

      <article className="card stack">
        <header>
          <h2>User Story 5: Register a new athlete</h2>
          <p>
            As an admin, I want to register a new athlete in the system so that they
            can be assigned to trainings and competitions.
          </p>
        </header>

        <AthleteForm
          isLoading={isLoading}
          serverError={error}
          onSubmit={mutate}
          onCancel={handleCancel}
          submitLabel="Register athlete"
        />
      </article>
    </section>
  );
}

export default AthleteCreatePage;
