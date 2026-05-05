// Controlled form for creating or editing an athlete.
// Used by AthleteCreatePage (create mode) and AthleteDetailPage (edit mode).
// The caller owns the mutation logic via onSubmit; this component stays pure UI.

import { useState, useEffect } from "react";
import { AthleteCreateInput } from "../types";

// All form values are strings while the user types; the form normalises them
// to the correct types (number | null) before calling onSubmit.
interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  height: string;
  weight: string;
  jersey_number: string;
}

const EMPTY_FORM: FormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  height: "",
  weight: "",
  jersey_number: "",
};

interface AthleteFormProps {
  /** Pre-filled values for edit mode; leave undefined for create mode. */
  initialValues?: Partial<AthleteCreateInput>;
  isLoading: boolean;
  serverError: string | null;
  onSubmit: (data: AthleteCreateInput) => void;
  onCancel: () => void;
  submitLabel?: string;
}

function AthleteForm({
  initialValues,
  isLoading,
  serverError,
  onSubmit,
  onCancel,
  submitLabel = "Save athlete",
}: AthleteFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [validationError, setValidationError] = useState<string>("");

  // Populate the form when initialValues arrive (e.g. after the athlete fetch).
  useEffect(() => {
    if (!initialValues) return;
    setValues({
      first_name: initialValues.first_name ?? "",
      last_name: initialValues.last_name ?? "",
      email: initialValues.email ?? "",
      phone: initialValues.phone ?? "",
      date_of_birth: initialValues.date_of_birth ?? "",
      height: initialValues.height != null ? String(initialValues.height) : "",
      weight: initialValues.weight != null ? String(initialValues.weight) : "",
      jersey_number:
        initialValues.jersey_number != null ? String(initialValues.jersey_number) : "",
    });
  }, [initialValues]);

  const handleChange = (field: keyof FormValues, value: string) => {
    setValidationError("");
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.first_name.trim() || !values.last_name.trim()) {
      setValidationError("First name and last name are required.");
      return;
    }
    if (!values.email.trim()) {
      setValidationError("Email is required.");
      return;
    }

    const parsePositiveFloat = (s: string): number | null => {
      const n = parseFloat(s);
      return s.trim() !== "" && n > 0 ? n : null;
    };
    const parsePositiveInt = (s: string): number | null => {
      const n = parseInt(s, 10);
      return s.trim() !== "" && n > 0 ? n : null;
    };

    const data: AthleteCreateInput = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      date_of_birth: values.date_of_birth || null,
      height: parsePositiveFloat(values.height),
      weight: parsePositiveFloat(values.weight),
      jersey_number: parsePositiveInt(values.jersey_number),
    };

    onSubmit(data);
  };

  const displayError = validationError || serverError;

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      <div className="form-row-2col">
        <label className="field" htmlFor="af-first-name">
          First name <span className="form-required">*</span>
          <input
            id="af-first-name"
            type="text"
            value={values.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            placeholder="e.g. Maria"
            required
          />
        </label>
        <label className="field" htmlFor="af-last-name">
          Last name <span className="form-required">*</span>
          <input
            id="af-last-name"
            type="text"
            value={values.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            placeholder="e.g. García"
            required
          />
        </label>
      </div>

      <label className="field" htmlFor="af-email">
        Email <span className="form-required">*</span>
        <input
          id="af-email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="athlete@example.com"
          required
        />
      </label>

      <label className="field" htmlFor="af-phone">
        Phone
        <input
          id="af-phone"
          type="tel"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+34 600 000 000"
        />
      </label>

      <label className="field" htmlFor="af-dob">
        Date of birth
        <input
          id="af-dob"
          type="date"
          value={values.date_of_birth}
          onChange={(e) => handleChange("date_of_birth", e.target.value)}
        />
      </label>

      <div className="form-row-3col">
        <label className="field" htmlFor="af-height">
          Height (cm)
          <input
            id="af-height"
            type="number"
            min="1"
            step="0.1"
            value={values.height}
            onChange={(e) => handleChange("height", e.target.value)}
            placeholder="175"
          />
        </label>
        <label className="field" htmlFor="af-weight">
          Weight (kg)
          <input
            id="af-weight"
            type="number"
            min="1"
            step="0.1"
            value={values.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
            placeholder="70"
          />
        </label>
        <label className="field" htmlFor="af-jersey">
          Jersey number
          <input
            id="af-jersey"
            type="number"
            min="1"
            step="1"
            value={values.jersey_number}
            onChange={(e) => handleChange("jersey_number", e.target.value)}
            placeholder="10"
          />
        </label>
      </div>

      {displayError && (
        <p className="form-error" role="alert">
          {displayError}
        </p>
      )}

      <div className="action-row">
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AthleteForm;
