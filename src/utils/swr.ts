// utils/swr.ts
import useSWR, { SWRConfiguration, KeyedMutator } from 'swr';

/**
 * Generic fetcher which:
 *  - accepts a URL (string)
 *  - looks for “token” in localStorage (or whatever you choose)
 *  - if token exists, adds “Authorization: Bearer …” header
 *  - returns parsed JSON (or throws if status >= 400)
 */
export async function fetcher(url: string) {
  // In Next.js/SSR you may need to guard window usage:
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    // You can customize this error shape however you like:
    const error = new Error(`Request failed with status ${res.status}`);
    // Optionally attach custom fields:
    // (error as any).status = res.status;
    throw error;
  }

  return res.json();
}

/**
 * A small wrapper hook around useSWR that defaults to our bearer‐token fetcher.
 *
 * @param key   The URL string (or null/array) that SWR will use as the cache key.
 * @param config  Optional SWRConfiguration (e.g. revalidateOnFocus, refreshInterval, etc.)
 *
 * @example
 * const { data, error, isLoading, mutate } = useApi<CourseData>(`https://…/api/courses/${id}`);
 */
export function useApi<T = any>(
  key: string | null,
  config?: SWRConfiguration
): {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: KeyedMutator<T>;
} {
  const { data, error, mutate, isValidating } = useSWR<T>(key, fetcher, config);

  return {
    data,
    error: error as Error | undefined,
    isLoading: !data && !error,
    mutate,
  };
}
