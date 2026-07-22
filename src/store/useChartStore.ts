import { create } from "zustand";
import {
  type Chart,
  type CharacterCard,
  createEmptyCard,
} from "@/types/chart";

// editor -> preview -> export 로 페이지가 넘어가도
// "지금 만들고 있는 취향표"가 유지되도록 하는 전역 상태입니다.

interface ChartState {
  chart: Chart;
  // --- 취향표 단위 ---
  setTitle: (title: string) => void;
  loadChart: (chart: Chart) => void;
  reset: () => void;
  // --- 카드 단위 ---
  addCard: () => void;
  removeCard: (id: string) => void;
  updateCard: (id: string, patch: Partial<CharacterCard>) => void;
}

const emptyChart = (): Chart => ({
  id: crypto.randomUUID(),
  title: "나의 취향표",
  cards: [createEmptyCard()],
});

export const useChartStore = create<ChartState>((set) => ({
  chart: emptyChart(),

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
}));
