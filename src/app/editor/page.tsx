"use client";

import { useMemo, useState, type MouseEvent, type ReactNode, type TouchEvent } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardEdit from "@/components/chart/CharacterCard";
import Button from "@/components/ui/Button";

const isInteractiveElement = (element: HTMLElement | null): boolean =>
  Boolean(element?.closest("input, button, textarea, label"));

class CustomMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent }: MouseEvent) =>
        !isInteractiveElement(nativeEvent.target as HTMLElement | null),
    },
  ];
}

class CustomTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: "onTouchStart" as const,
      handler: ({ nativeEvent }: TouchEvent) =>
        !isInteractiveElement(nativeEvent.target as HTMLElement | null),
    },
  ];
}

function SortableCard({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "pan-y",
      }}
      className={isDragging ? "opacity-0" : ""}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

/**
 * [담당 B] 취향표 편집·생성 (시안: "커스텀 취향표 진입" / "생성 중")
 * 제목 편집 + 카드들 편집 + 칸 추가 + Done!(→ /preview)
 */
export default function EditorPage() {
  const { chart, setTitle, addCard, loadChart } = useChartStore();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(CustomMouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(CustomTouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
  );

  const activeCard = useMemo(
    () => chart.cards.find((card) => card.id === activeCardId) ?? null,
    [activeCardId, chart.cards],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCardId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = chart.cards.findIndex((card) => card.id === active.id);
    const newIndex = chart.cards.findIndex((card) => card.id === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    loadChart({
      ...chart,
      cards: arrayMove(chart.cards, oldIndex, newIndex),
    });
  };

  return (
    <div className="screen-pad flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-2">
        <input
          value={chart.title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-0 flex-1 font-title text-[30px] outline-none"
        />
        <Link href="/preview">
          <Button>Done!</Button>
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveCardId(null)}
      >
        <SortableContext
          items={chart.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-6 flex flex-col gap-3">
            {chart.cards.map((card) => (
              <SortableCard key={card.id} id={card.id}>
                <CharacterCardEdit card={card} />
              </SortableCard>
            ))}

            <button
              onClick={addCard}
              className="rounded-2xl border border-dashed border-zinc-300 py-3 text-sm text-zinc-500 hover:bg-zinc-50"
            >
              + 칸 추가
            </button>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCard ? (
            <div className="scale-[1.01] rounded-2xl bg-zinc-100/35 shadow-lg ring-1 ring-zinc-200">
              <CharacterCardEdit card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
