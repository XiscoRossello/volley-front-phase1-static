// Typed API helpers for every endpoint used by the six user stories.
// GET helpers live in the top section; POST/PUT/PATCH/DELETE helpers follow.
// All field names verified against the sportsclub Django Ninja source.

import { fetchJson, mutateJson } from "./client";
import {
  Athlete,
  AthleteListItem,
  AthleteCreateInput,
  AthleteUpdateInput,
  Coach,
  CoachListItem,
  Competition,
  CompetitionListItem,
  CompetitionPatchInput,
  SeasonListItem,
  Training,
  TrainingListItem,
  Venue,
  TryoutBookingInput,
} from "../types";

// ─── GET helpers ────────────────────────────────────────────────────────────

export const getAthletes = (signal?: AbortSignal) =>
  fetchJson<AthleteListItem[]>("/people/athletes", signal);

export const getAthlete = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Athlete>(`/people/athletes/${publicId}`, signal);

export const getCoaches = (signal?: AbortSignal) =>
  fetchJson<CoachListItem[]>("/people/coaches", signal);

export const getCoach = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Coach>(`/people/coaches/${publicId}`, signal);

export const getCompetitions = (signal?: AbortSignal) =>
  fetchJson<CompetitionListItem[]>("/scheduling/competitions", signal);

export const getCompetition = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Competition>(`/scheduling/competitions/${publicId}`, signal);

export const getTrainings = (signal?: AbortSignal) =>
  fetchJson<TrainingListItem[]>("/scheduling/trainings", signal);

export const getTraining = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Training>(`/scheduling/trainings/${publicId}`, signal);

export const getVenue = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Venue>(`/inventory/venues/${publicId}`, signal);

// Seasons — needed by the competition edit form to resolve season_public_id.
export const getSeasons = (signal?: AbortSignal) =>
  fetchJson<SeasonListItem[]>("/scheduling/seasons", signal);

// ─── Mutation helpers (POST / PUT / PATCH / DELETE) ─────────────────────────

// Story 5 — create a new athlete.
// POST /people/athletes → 201 AthleteOut
export const createAthlete = (body: AthleteCreateInput) =>
  mutateJson<Athlete>("POST", "/people/athletes", body);

// Story 4 — partially update an athlete.
// PATCH /people/athletes/{id} → AthleteOut
export const patchAthlete = (publicId: string, body: AthleteUpdateInput) =>
  mutateJson<Athlete>("PATCH", `/people/athletes/${publicId}`, body);

// Story 4 — delete an athlete.
// DELETE /people/athletes/{id} → 204 No Content
export const deleteAthlete = (publicId: string) =>
  mutateJson<null>("DELETE", `/people/athletes/${publicId}`);

// Story 6 — partially update a competition (score + roster).
// PATCH /scheduling/competitions/{id} → CompetitionOut
export const patchCompetition = (publicId: string, body: CompetitionPatchInput) =>
  mutateJson<Competition>("PATCH", `/scheduling/competitions/${publicId}`, body);

// Story 1 — book a tryout session.
// No backend endpoint exists yet → simulated 1.2s async delay.
// Append "fail" anywhere in the notes field to trigger the error path.
export const bookTryout = (body: TryoutBookingInput): Promise<{ confirmed: boolean }> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (body.notes.toLowerCase().includes("fail")) {
        reject(new Error("The server rejected the booking. Please try again."));
      } else {
        resolve({ confirmed: true });
      }
    }, 1200);
  });
