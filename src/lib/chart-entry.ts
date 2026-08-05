import { getGroup } from "@/data/charts";
import { groupToChart } from "@/types/chart";

export type ChartEntrySource = "new" | "template";

export const getChartEntryHref = (
  pathname: string,
  source: ChartEntrySource,
  groupId?: string,
) => {
  const params = new URLSearchParams();
  params.set("source", source);

  if (source === "template" && groupId) {
    params.set("group", groupId);
  }

  return `${pathname}?${params.toString()}`;
};

export const getChartEntrySource = (source: string | null): ChartEntrySource =>
  source === "template" ? "template" : "new";

export const getTemplateChartFromParams = (
  source: string | null,
  groupId: string | null,
) => {
  if (source !== "template" || !groupId) {
    return null;
  }

  const group = getGroup(groupId);
  if (!group) {
    return null;
  }

  return groupToChart(group);
};

export const shouldRestoreTemplateOnReload = () => {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return false;
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  return navigationEntry?.type === "reload";
};
