"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardEdit from "@/components/chart/CharacterCard";
import Button from "@/components/ui/Button";

const LONG_PRESS_MS = 300;

/**
 * [담당 B] 취향표 편집·생성 (시안: "커스텀 취향표 진입" / "생성 중")
 * 제목 편집 + 카드들 편집 + 칸 추가 + Done!(→ /preview)
 */
export default function EditorPage() {
  const { chart, setTitle, addCard, reorderCards } = useChartStore();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pressTimerRef = useRef<number | null>(null);
  const activeCardIdRef = useRef<string | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  const clearPressTimer = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!draggingCardId) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (
        pointerIdRef.current !== event.pointerId ||
        !activeCardIdRef.current
      ) {
        return;
      }

      event.preventDefault();

      const targetIndex = chart.cards.findIndex((candidate) => {
        const element = cardRefs.current[candidate.id];
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2;
      });

      const currentIndex = chart.cards.findIndex(
        (candidate) => candidate.id === activeCardIdRef.current,
      );

      if (currentIndex < 0) return;

      const nextIndex =
        targetIndex === -1 ? chart.cards.length - 1 : targetIndex;

      if (currentIndex !== nextIndex) {
        reorderCards(currentIndex, nextIndex);
      }
    };

    const stopDragging = () => {
      clearPressTimer();
      activeCardIdRef.current = null;
      pointerIdRef.current = null;
      setDraggingCardId(null);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [chart.cards, draggingCardId, reorderCards]);

  return (
    <div className="screen-pad flex flex-1 flex-col">
      {/* 헤더: 제목 + Done */}
      <div className="flex items-center justify-between gap-2">
        <input
          value={chart.title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-0 flex-1 font-title text-2xl outline-none"
        />
        <Link href="/preview">
          <Button>Done!</Button>
        </Link>
      </div>

      {/* 카드들 */}
      <div className="mt-6 flex flex-col gap-3">
        {chart.cards.map((card) => (
          <div
            key={card.id}
            ref={(element) => {
              cardRefs.current[card.id] = element;
            }}
            onPointerDown={(event) => {
              if (
                event.pointerType === "mouse" &&
                event.button !== 0
              ) {
                return;
              }

              const target = event.target;
              if (
                target instanceof HTMLElement &&
                target.closest("input, button, textarea, label")
              ) {
                return;
              }

              clearPressTimer();
              activeCardIdRef.current = card.id;
              pointerIdRef.current = event.pointerId;
              pressTimerRef.current = window.setTimeout(() => {
                setDraggingCardId(card.id);
              }, LONG_PRESS_MS);
            }}
            onPointerUp={clearPressTimer}
            onPointerLeave={clearPressTimer}
            onPointerCancel={clearPressTimer}
            className={
              draggingCardId === card.id
                ? "scale-[1.01] opacity-80 shadow-sm transition"
                : "transition"
            }
            style={{
              touchAction: draggingCardId === card.id ? "none" : "pan-y",
            }}
          >
            <CharacterCardEdit card={card} />
          </div>
        ))}

        {/* 칸 추가 */}
        <button
          onClick={addCard}
          className="rounded-2xl border border-dashed border-zinc-300 py-3 text-sm text-zinc-500 hover:bg-zinc-50"
        >
          + 칸 추가
        </button>
      </div>
    </div>
  );
}
