"use client";

import Link from "next/link";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardView from "@/components/chart/CharacterCardView";

/**
 * [담당 B] 내보내기 / 공유 (시안: "내보내기" / "사진 클릭 시")
 * 카드 그리드(2열) + 취향표 저장 / X로 공유하기.
 * TODO: 실제 이미지 캡처(예: html-to-image, dom-to-image)로 저장/공유 연결
 */
export default function ExportPage() {
  const { chart } = useChartStore();

  const handleSave = () => {
    // TODO: 카드 영역을 이미지로 캡처 후 다운로드
    alert("이미지 저장 기능은 아직 준비 중이에요");
  };

  const handleShareX = () => {
    // TODO: X(트위터) 공유 인텐트 연결
    alert("X 공유 기능은 아직 준비 중이에요");
  };

  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <h1 className="text-2xl font-bold">취향표 저장과 공유</h1>
      <p className="mt-2 text-sm text-zinc-500">사진을 눌러 확인해 보세요!</p>

      {/* 캡처 대상 영역 */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-bold">{chart.title}</p>
        <div className="grid grid-cols-2 gap-3">
          {chart.cards.map((card) => (
            <CharacterCardView key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* 저장 / 공유 */}
      <div className="mt-8 flex justify-center gap-10">
        <button
          onClick={handleSave}
          className="flex flex-col items-center gap-2 text-xs text-zinc-600"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            ↓
          </span>
          취향표
          <br />저장
        </button>
        <button
          onClick={handleShareX}
          className="flex flex-col items-center gap-2 text-xs text-zinc-600"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
            X
          </span>
          X로
          <br />공유하기
        </button>
      </div>

      <div className="mt-6 text-sm">
        <Link href="/preview" className="text-zinc-600">
          ◀ 이전
        </Link>
      </div>
    </div>
  );
}
