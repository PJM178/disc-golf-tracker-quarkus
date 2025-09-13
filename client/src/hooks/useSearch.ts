import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

interface UseSearchOptions<T> {
  query: string;
  queryFn: (query: string) => Promise<T>;

  /**
   * Optional: Time in milliseconds before the data is considered stale.
   * Defaults to 0 (always refetch on mount).
   */
  staleTime?: number;

  /**
   * Optional: placeholder data strategy.
   * e.g. keepPreviousData, a function, or raw placeholder data
   */
  placeholderData?: UseQueryOptions<T>["placeholderData"];
}

const useSearch = <T,>({ query, queryFn, staleTime, placeholderData }: UseSearchOptions<T>) => {
  return (
    useQuery({
      queryKey: ["search", query],
      queryFn: () => queryFn(query),
      staleTime: staleTime,
      enabled: query.length > 2,
      placeholderData,
    })
  );
}

export default useSearch;