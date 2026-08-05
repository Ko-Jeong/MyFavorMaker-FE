"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
import {
  getChartEntryHref,
  getChartEntrySource,
  getTemplateChartFromParams,
  isBrowserReload,
} from "@/lib/chart-entry";

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
  const { chart, setTitle, addCard, loadChart, reset } = useChartStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const titleMeasureRef = useRef<HTMLSpanElement>(null);
  const [titleWidth, setTitleWidth] = useState<number>(0);
  const trimmedTitle = chart.title.trim();
  const displayTitle = trimmedTitle || "나의 취향표";
  const sensors = useSensors(
    useSensor(CustomMouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(CustomTouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
  );
  const source = getChartEntrySource(searchParams.get("source"));
  const groupId = searchParams.get("group");
  const previewHref = getChartEntryHref("/preview", source, groupId ?? undefined);

  const activeCard = useMemo(
    () => chart.cards.find((card) => card.id === activeCardId) ?? null,
    [activeCardId, chart.cards],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isBrowserReload(pathname)) {
      return;
    }

    if (source === "template") {
      const templateChart = getTemplateChartFromParams(source, groupId);
      if (templateChart) {
        loadChart(templateChart);
      }
      return;
    }

    reset();
  }, [groupId, loadChart, pathname, reset, source]);

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

  const stopTitleEditOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsEditingTitle(false);
      event.currentTarget.blur();
    }
  };

  useEffect(() => {
    if (!isEditingTitle || !titleInputRef.current) return;

    const { current } = titleInputRef;
    current.focus();
    const end = current.value.length;
    current.setSelectionRange(end, end);
  }, [isEditingTitle]);

  useEffect(() => {
    if (!titleMeasureRef.current) return;
    setTitleWidth(titleMeasureRef.current.offsetWidth);
  }, [chart.title]);

  return (
    <div className="screen-pad flex flex-1 flex-col">
      <div className="relative pr-[84px]">
        <div className="flex items-center gap-1.5">
          <div className="min-w-0" style={{ width: titleWidth ? `${titleWidth + 2}px` : undefined }}>
            <span
              ref={titleMeasureRef}
              className="pointer-events-none absolute -z-10 whitespace-pre font-title text-[30px] opacity-0"
            >
              {displayTitle}
            </span>
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                value={chart.title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={stopTitleEditOnEnter}
                className="w-full min-w-0 font-title text-[30px] text-zinc-900 placeholder:text-zinc-400 outline-none"
                style={{ width: `${Math.max(titleWidth + 2, 12)}px` }}
                placeholder="나의 취향표"
              />
            ) : (
              <h1
                className={
                  trimmedTitle
                    ? "truncate font-title text-[30px] text-zinc-900"
                    : "truncate font-title text-[30px] text-zinc-400"
                }
              >
                {displayTitle}
              </h1>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsEditingTitle(true)}
            className="shrink-0"
            aria-label="제목 수정"
          >
            <img
              src="/icons/pencil.svg"
              alt=""
              aria-hidden="true"
              className="h-[14px] w-[14px]"
            />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 justify-end">
          <Link href={previewHref}>
            <Button className="w-[72px]">Done!</Button>
          </Link>
        </div>
      </div>

      {isMounted ? (
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
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {chart.cards.map((card) => (
            <CharacterCardEdit key={card.id} card={card} />
          ))}

          <button
            onClick={addCard}
            className="rounded-2xl border border-dashed border-zinc-300 py-3 text-sm text-zinc-500 hover:bg-zinc-50"
          >
            + 칸 추가
          </button>
        </div>
      )}

      <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+12px)] pt-6">
        <div className="flex items-center justify-between text-sm font-medium">
          <Link href="/charts" className="inline-flex items-center gap-1.5 text-[16px] text-zinc-500">
            <img
              src="/icons/nav-left.svg"
              alt=""
              aria-hidden="true"
              className="h-4.3 w-4.3"
            />
            이전
          </Link>
          <span aria-hidden="true" className="w-[72px]" />
        </div>
      </div>
    </div>
  );
}
