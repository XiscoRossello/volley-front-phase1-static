export interface Athlete {
  id: number;
  fullName: string;
  age: number;
  discipline: string;
  level: string;
  city: string;
  status: string;
}

export interface Coach {
  id: number;
  fullName: string;
  specialization: string;
  yearsExperience: number;
  contactEmail: string;
}

export interface TryoutSession {
  id: number;
  title: string;
  date: string;
  location: string;
  seatsLeft: number;
}
