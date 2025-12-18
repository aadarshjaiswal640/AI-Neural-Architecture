import { useQuery } from "@tanstack/react-query";
import type { Statistics, ChartData } from "@shared/schema";

export function useStatistics() {
  return useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });
}

export function useChartData() {
  return useQuery<ChartData>({
    queryKey: ["/api/charts"],
  });
}

export function useModels() {
  return useQuery<any[]>({
    queryKey: ["/api/models"],
  });
}

export function useRecommendations() {
  return useQuery<any[]>({
    queryKey: ["/api/recommendations"],
  });
}
