import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  type Chart,
  type CharacterCard,
  createEmptyCard,
  uid,
} from "@/types/chart";

// editor -> preview -> export 로 페이지가 넘어가도
// "지금 만들고 있는 취향표"가 유지되도록 하는 전역 상태입니다.

interface ChartState {
  chart: Chart;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  // --- 취향표 단위 ---
  setTitle: (title: string) => void;
  loadChart: (chart: Chart) => void;
  reset: () => void;
  // --- 카드 단위 ---
  addCard: () => void;
  removeCard: (id: string) => void;
  updateCard: (id: string, patch: Partial<CharacterCard>) => void;
  reorderCards: (fromIndex: number, toIndex: number) => void;
}

const emptyChart = (): Chart => ({
  id: uid(),
  title: "나의 취향표",
  cards: [createEmptyCard()],
});

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      chart: emptyChart(),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      setTitle: (title) =>
        set((s) => ({ chart: { ...s.chart, title } })),

      loadChart: (chart) => set({ chart }),

      reset: () => set({ chart: emptyChart() }),

      addCard: () =>
        set((s) => ({
          chart: { ...s.chart, cards: [...s.chart.cards, createEmptyCard()] },
        })),

      removeCard: (id) =>
        set((s) => ({
          chart: {
            ...s.chart,
            cards: s.chart.cards.filter((c) => c.id !== id),
          },
        })),

      updateCard: (id, patch) =>
        set((s) => ({
          chart: {
            ...s.chart,
            cards: s.chart.cards.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
          },
        })),

      reorderCards: (fromIndex, toIndex) =>
        set((s) => {
          const cards = [...s.chart.cards];
          if (
            fromIndex === toIndex ||
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= cards.length ||
            toIndex >= cards.length
          ) {
            return s;
          }

          const [moved] = cards.splice(fromIndex, 1);
          cards.splice(toIndex, 0, moved);

          return {
            chart: {
              ...s.chart,
              cards,
            },
          };
        }),
    }),
    {
      name: "cp-maker-chart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ chart: state.chart }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
