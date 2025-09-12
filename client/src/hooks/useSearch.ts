import { useQuery } from "@tanstack/react-query";

interface UseSearchOptions<T> {
  query: string;
  queryFn: (query: string) => Promise<T>;

  /**
   * Optional: Time in milliseconds before the data is considered stale.
   * Defaults to 0 (always refetch on mount).
   */
  staleTime?: number;
}

const useSearch = <T,>({ query, queryFn, staleTime }: UseSearchOptions<T>) => {
  return (
    useQuery({
      queryKey: ["search", query],
      queryFn: () => queryFn(query),
      staleTime: staleTime,
      enabled: query.length > 2,
    })
  );
}

export default useSearch;