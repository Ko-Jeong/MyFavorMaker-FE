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

const TEMPLATE_RELOAD_KEY = "cp-maker-template-reload-pending";

export const shouldRestoreTemplateOnReload = () => {
  if (
    typeof window === "undefined" ||
    typeof performance === "undefined" ||
    typeof sessionStorage === "undefined"
  ) {
    return false;
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const isReload = navigationEntry?.type === "reload";

  if (isReload && !sessionStorage.getItem(TEMPLATE_RELOAD_KEY)) {
    sessionStorage.setItem(TEMPLATE_RELOAD_KEY, "pending");
  }

  const shouldRestore = sessionStorage.getItem(TEMPLATE_RELOAD_KEY) === "pending";

  if (shouldRestore) {
    sessionStorage.setItem(TEMPLATE_RELOAD_KEY, "consumed");
  }

  return shouldRestore;
};
