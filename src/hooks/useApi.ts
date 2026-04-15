// Single reusable hook for every GET in the app.
// Pages stay tiny because all the loading/error plumbing lives here:
//   - fires the request when `deps` change (component mount, route param change)
//   - cancels any in-flight request if the component unmounts first
//   - exposes the classic { data, isLoading, error } triple so the UI can
//     branch into spinner / error state / happy path.

import { useEffect, useState } from "react";

type AsyncLoader<T> = (signal: AbortSignal) => Promise<T>;

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>(loader: AsyncLoader<T>, deps: ReadonlyArray<unknown>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fresh AbortController per effect run so that, if the user navigates away
    // before the response arrives, we cancel the request and skip the setState
    // calls on an unmounted component.
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    loader(controller.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        // Ignore aborts — they are the "expected" cancellation path and would
        // otherwise flash an error state during normal navigation.
        if ((cause as Error)?.name === "AbortError") {
          return;
        }
        setData(null);
        setError((cause as Error)?.message ?? "Unknown error while loading data.");
        setLoading(false);
      });

    return () => controller.abort();
    // Consumers pass the deps explicitly (route params, filters, etc.), so we
    // silence the exhaustive-deps rule to avoid double-fetching on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error };
}
