// Generic hook for every write operation in the app (POST, PUT, PATCH, DELETE).
//
// Usage:
//   const { mutate, isLoading, error, data } = useMutation(createAthlete);
//   <button onClick={() => mutate(formData)} disabled={isLoading}>Save</button>
//
// The hook tracks the in-flight state so the UI can:
//   - disable the submit button while the request is processing
//   - surface a friendly error message if the API rejects the submission
//   - hand back the response to the caller via the onSuccess callback

import { useState, useCallback } from "react";

interface MutationState<TResult> {
  isLoading: boolean;
  error: string | null;
  data: TResult | null;
}

interface UseMutationReturn<TInput, TResult> extends MutationState<TResult> {
  mutate: (input: TInput) => Promise<TResult | null>;
  reset: () => void;
}

export function useMutation<TInput, TResult>(
  fn: (input: TInput) => Promise<TResult | null>,
  callbacks?: {
    onSuccess?: (result: TResult | null) => void;
    onError?: (message: string) => void;
  },
): UseMutationReturn<TInput, TResult> {
  const [state, setState] = useState<MutationState<TResult>>({
    isLoading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(
    async (input: TInput): Promise<TResult | null> => {
      setState({ isLoading: true, error: null, data: null });

      try {
        const result = await fn(input);
        setState({ isLoading: false, error: null, data: result });
        callbacks?.onSuccess?.(result);
        return result;
      } catch (cause) {
        const message =
          (cause as Error)?.message ?? "An unexpected error occurred. Please try again.";
        setState({ isLoading: false, error: message, data: null });
        callbacks?.onError?.(message);
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn],
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return { ...state, mutate, reset };
}
