"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardView from "@/components/chart/CharacterCardView";
import PageNavigation from "@/components/ui/PageNavigation";
import {
  getChartEntryHref,
  getChartEntrySource,
} from "@/lib/chart-entry";

/**
 * [담당 B] 미리보기 (시안: "프리뷰")
 * 읽기전용 카드 확인 + 이전/다음 이동.
 * 이전 → /editor, 다음 → /export
 */
function PreviewPageContent() {
  const { chart } = useChartStore();
  const searchParams = useSearchParams();
  const source = getChartEntrySource(searchParams.get("source"));
  const groupId = searchParams.get("group");
  const editorHref = getChartEntryHref("/editor", source, groupId ?? undefined);
  const exportHref = getChartEntryHref("/export", source, groupId ?? undefined);

  return (
    <div className="screen-pad select-none flex flex-1 flex-col">
      <h1 className="page-title">미리보기</h1>
      <p className="mt-1 text-sm text-zinc-500">카드 내용과 순서를 확인해 주세요</p>
      <p className="mt-4 break-words font-title text-lg text-zinc-900">
        {chart.title || "나의 취향표"}
      </p>

      <div className="mt-2 flex flex-col gap-4">
        {chart.cards.map((card) => (
          <CharacterCardView key={card.id} card={card} />
        ))}
      </div>
      <PageNavigation
        previous={{ href: editorHref, label: "이전" }}
        next={{ href: exportHref, label: "다음" }}
      />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex flex-1" />}>
      <PreviewPageContent />
    </Suspense>
  );
}
