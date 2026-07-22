"use client";

import Link from "next/link";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardView from "@/components/chart/CharacterCardView";

/**
 * [담당 B] 미리보기 (시안: "프리뷰")
 * 읽기전용 카드 확인 + 이전/다음 이동.
 * 이전 → /editor, 다음 → /export
 */
export default function PreviewPage() {
  const { chart } = useChartStore();

  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <h1 className="font-title text-2xl">미리보기</h1>
      <p className="mt-2 text-sm text-zinc-500">카드 내용과 순서를 확인해주세요</p>

      <div className="mt-6 flex flex-col gap-4">
        {chart.cards.map((card) => (
          <CharacterCardView key={card.id} card={card} />
        ))}
      </div>

      {/* 이전 / 다음 */}
      <div className="mt-6 flex items-center justify-between text-sm font-medium">
        <Link href="/editor" className="text-zinc-600">
          ◀ 이전
        </Link>
        <Link href="/export" className="text-zinc-900">
          다음 ▶
        </Link>
      </div>
    </div>
  );
}
