"use client";

import Link from "next/link";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardEdit from "@/components/chart/CharacterCard";
import Button from "@/components/ui/Button";

/**
 * [담당 B] 취향표 편집·생성 (시안: "커스텀 취향표 진입" / "생성 중")
 * 제목 편집 + 카드들 편집 + 칸 추가 + Done!(→ /preview)
 */
export default function EditorPage() {
  const { chart, setTitle, addCard } = useChartStore();

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
          <CharacterCardEdit key={card.id} card={card} />
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
