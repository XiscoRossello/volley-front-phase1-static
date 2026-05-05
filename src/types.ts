// TypeScript mirrors of the Django Ninja schemas.
// Split into "ListOut" (lean) and "Out" (full) types because the backend uses
// narrower payloads for list endpoints and fuller ones for detail endpoints.
//
// Phase 3 adds input types for every write operation — field names match the
// Django Ninja schemas exactly (verified against the sportsclub source).

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

// ── Athlete write inputs (mirrors AthleteIn / AthletePatch in Django Ninja) ──

// POST /people/athletes  →  AthleteIn: all required except optional fields
export interface AthleteCreateInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;       // ISO date "YYYY-MM-DD"
  height: number | null;              // cm, must be > 0
  weight: number | null;              // kg, must be > 0
  jersey_number: number | null;
  // address_public_id omitted — we don't expose address management in the UI
}

// PATCH /people/athletes/{id}  →  AthletePatch: all fields optional
export type AthleteUpdateInput = Partial<AthleteCreateInput>;

// ─────────────────────────────────────────────────────────────────────────────

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

// Reference shapes — the backend embeds these inside larger resources.
export interface SeasonRef {
  public_id: string;
  name: string;
}

// Season list item (from /scheduling/seasons)
export interface SeasonListItem {
  public_id: string;
  name: string;
  start_date: string;
  end_date: string;
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

// Competition score — backend schema: { results: { [discipline]: MedalCount } }
// Disciplines: sprints | long_distance | relays | high_jump | long_jump
export type Discipline =
  | "sprints"
  | "long_distance"
  | "relays"
  | "high_jump"
  | "long_jump";

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

export interface CompetitionScore {
  results: Partial<Record<Discipline, MedalCount>>;
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

// ── Competition write input (mirrors CompetitionPatch — PATCH only) ──────────
// We use PATCH so we only send what the form touches (score + roster).
export interface CompetitionPatchInput {
  score?: CompetitionScore | null;
  athlete_public_ids?: string[];
  coach_public_ids?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────

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

// ── Tryout (local-only) ──────────────────────────────────────────────────────

// Tryout sessions have no backend counterpart, so they live as mock JSON.
export interface TryoutSession {
  id: number;
  title: string;
  date: string;
  location: string;
  seatsLeft: number;
}

// Input for the simulated bookTryout call.
export interface TryoutBookingInput {
  athletePublicId: string;
  sessionId: number;
  notes: string;
}
