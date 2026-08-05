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
    <div className="screen-pad select-none flex flex-1 flex-col">
      <h1 className="font-title text-[30px]">미리보기</h1>
      <p className="mt-2 text-sm text-zinc-500">카드 내용과 순서를 확인해 주세요</p>

      <div className="mt-6 flex flex-col gap-4">
        {chart.cards.map((card) => (
          <CharacterCardView key={card.id} card={card} />
        ))}
      </div>

      {/* 이전 / 다음 */}
      <div className="mt-auto flex items-center justify-between pb-[calc(env(safe-area-inset-bottom)+12px)] pt-6 text-sm font-medium">
        <Link href="/editor" className="inline-flex items-center gap-1.5 text-[16px] text-zinc-500">
          <img
            src="/icons/nav-left.svg"
            alt=""
            aria-hidden="true"
            className="h-4.3 w-4.3"
          />
          이전
        </Link>
        <Link href="/export" className="inline-flex items-center gap-1.5 text-[16px] text-zinc-500">
          다음
          <img
            src="/icons/nav-right.svg"
            alt=""
            aria-hidden="true"
            className="h-4.3 w-4.3"
          />
        </Link>
      </div>
    </div>
  );
}
