// Small date helpers. The API returns ISO strings; we format them once at the
// UI boundary so every page displays dates in the user's locale.

export function formatDateTime(isoString: string): string {
  const parsed = new Date(isoString);
  // Fall back to the raw string if the backend ever sends something that is
  // not a valid date — better than showing "Invalid Date" to the user.
  if (Number.isNaN(parsed.getTime())) {
    return isoString;
  }
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDate(isoString: string): string {
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return isoString;
  }
  return parsed.toLocaleDateString(undefined, { dateStyle: "medium" });
}
