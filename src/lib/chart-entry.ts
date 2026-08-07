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

let hasHandledBrowserReload = false;

export const isBrowserReload = (pathname?: string) => {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return false;
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (navigationEntry?.type !== "reload") {
    return false;
  }

  if (hasHandledBrowserReload) {
    return false;
  }

  if (pathname) {
    const entryUrl = navigationEntry.name
      ? new URL(navigationEntry.name)
      : null;

    if (entryUrl?.pathname !== pathname) {
      return false;
    }
  }

  // `performance.getEntriesByType("navigation")` describes the whole
  // document, so it still says "reload" when a client-side navigation later
  // mounts this page again. Consume the reload signal once per document to
  // avoid resetting edits when returning from preview.
  hasHandledBrowserReload = true;
  return true;
};
