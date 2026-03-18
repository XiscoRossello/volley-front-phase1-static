import { useState } from "react";
import coachesData from "../data/coaches.json";
import { Coach } from "../types";

function CoachDirectory() {
  const [coaches] = useState<Coach[]>(coachesData);

  return (
    <section className="stack" aria-label="Coach directory">
      <h2>Coach Directory</h2>
      <div className="grid cols-2">
        {coaches.map((coach) => (
          <article className="card stack" key={coach.id}>
            <h3>{coach.fullName}</h3>
            <p>
              <strong>Specialization:</strong> {coach.specialization}
            </p>
            <p>
              <strong>Experience:</strong> {coach.yearsExperience} years
            </p>
            <p>
              <strong>Contact:</strong> {coach.contactEmail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CoachDirectory;
