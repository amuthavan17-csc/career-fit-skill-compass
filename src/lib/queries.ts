import { queryOptions } from "@tanstack/react-query";
import { getReport, listJobs } from "./skillmatch.functions";

export const jobsQuery = queryOptions({
  queryKey: ["jobs"],
  queryFn: () => listJobs(),
  staleTime: 60_000,
});

export const reportQuery = (id: string) =>
  queryOptions({
    queryKey: ["report", id],
    queryFn: () => getReport({ data: { id } }),
  });
