// Typed GET helpers for every endpoint the four user stories need.
// Centralising them here means components never hardcode URLs and TypeScript
// infers the response shape automatically from the return type.

import { fetchJson } from "./client";
import {
  Athlete,
  AthleteListItem,
  Coach,
  CoachListItem,
  Competition,
  CompetitionListItem,
  Training,
  TrainingListItem,
  Venue,
} from "../types";

// People — athletes and coaches used by stories 1, 2 and 4.
export const getAthletes = (signal?: AbortSignal) =>
  fetchJson<AthleteListItem[]>("/people/athletes", signal);

export const getAthlete = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Athlete>(`/people/athletes/${publicId}`, signal);

export const getCoaches = (signal?: AbortSignal) =>
  fetchJson<CoachListItem[]>("/people/coaches", signal);

export const getCoach = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Coach>(`/people/coaches/${publicId}`, signal);

// Scheduling — competitions (story 3) and trainings (story 4).
export const getCompetitions = (signal?: AbortSignal) =>
  fetchJson<CompetitionListItem[]>("/scheduling/competitions", signal);

export const getCompetition = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Competition>(`/scheduling/competitions/${publicId}`, signal);

export const getTrainings = (signal?: AbortSignal) =>
  fetchJson<TrainingListItem[]>("/scheduling/trainings", signal);

export const getTraining = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Training>(`/scheduling/trainings/${publicId}`, signal);

// Inventory — venues are fetched lazily from the competition detail page to
// show the full address only when the user actually navigates there.
export const getVenue = (publicId: string, signal?: AbortSignal) =>
  fetchJson<Venue>(`/inventory/venues/${publicId}`, signal);
