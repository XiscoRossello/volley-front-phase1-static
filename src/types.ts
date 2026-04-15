// TypeScript mirrors of the Django Ninja schemas.
// Split into "ListOut" (lean) and "Out" (full) types because the backend uses
// narrower payloads for list endpoints and fuller ones for detail endpoints.

export interface Address {
  public_id: string;
  line1: string;
  line2: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  formatted_address: string;
}

// Minimal athlete shape returned by /people/athletes — enough for cards and
// selectors; full profile data comes from the detail endpoint below.
export interface AthleteListItem {
  public_id: string;
  first_name: string;
  last_name: string;
  jersey_number: number | null;
}

// Detail shape returned by /people/athletes/{public_id}.
export interface Athlete extends AthleteListItem {
  email: string;
  phone: string;
  date_of_birth: string | null;
  address: Address | null;
  height: number | null;
  weight: number | null;
}

export interface CoachListItem {
  public_id: string;
  first_name: string;
  last_name: string;
  certification: string | null;
}

export interface Coach extends CoachListItem {
  email: string;
  phone: string;
  date_of_birth: string | null;
  address: Address | null;
}

// Reference shapes — the backend embeds these inside larger resources
// (competitions, trainings) instead of repeating the full payload.
export interface SeasonRef {
  public_id: string;
  name: string;
}

export interface VenueRef {
  public_id: string;
  name: string;
}

export interface PersonRef {
  public_id: string;
  display_name: string;
}

export interface AthleteRef extends PersonRef {
  jersey_number: number | null;
}

export type CoachRef = PersonRef;

// Competition score is an open-ended dict on the backend, so we keep it loose.
export interface CompetitionScore {
  home?: number;
  away?: number;
  [key: string]: unknown;
}

export interface CompetitionListItem {
  public_id: string;
  name: string;
  date: string;
  season: SeasonRef;
}

export interface Competition extends CompetitionListItem {
  venue: VenueRef | null;
  coaches: CoachRef[];
  athletes: AthleteRef[];
  score: CompetitionScore | null;
}

export interface Venue {
  public_id: string;
  name: string;
  venue_type: string;
  capacity: number | null;
  address: Address | null;
  indoor: boolean;
}

export interface TrainingListItem {
  public_id: string;
  name: string;
  date: string;
  season: SeasonRef;
  focus: string;
}

export interface Training extends TrainingListItem {
  venue: VenueRef | null;
  coaches: CoachRef[];
  athletes: AthleteRef[];
}

// Local-only type: tryout sessions have no backend counterpart yet, so they
// stay as mock JSON until phase 3 adds write operations.
export interface TryoutSession {
  id: number;
  title: string;
  date: string;
  location: string;
  seatsLeft: number;
}
