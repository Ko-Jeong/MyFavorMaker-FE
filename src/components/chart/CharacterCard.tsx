"use client";

/* eslint-disable @next/next/no-img-element */
import { type CharacterCard, rightPercent } from "@/types/chart";
import { useChartStore } from "@/store/useChartStore";
import PreferenceSlider from "@/components/ui/PreferenceSlider";
import Card from "@/components/ui/Card";

/**
 * 편집용 카드 (editor 화면).
 * 이름 / 왼 퍼센트(숫자 입력) / 코멘트 수정 + 삭제(×).
 * 퍼센트바는 유저가 직접 조절하지 않고, 왼 퍼센트 값에 따라 자동으로 채워집니다.
 * 사진 업로드는 TODO.
 */
export default function CharacterCardEdit({ card }: { card: CharacterCard }) {
  const { updateCard, removeCard } = useChartStore();

  const setLeftPercent = (raw: string) => {
    const n = Number(raw.replace(/[^0-9]/g, ""));
    updateCard(card.id, { leftPercent: Math.max(0, Math.min(100, n || 0)) });
  };

  return (
    <Card className="relative">
      {/* 삭제 버튼 */}
      <button
        onClick={() => removeCard(card.id)}
        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
        aria-label="카드 삭제"
      >
        ✕
      </button>

      <div className="flex items-center gap-3">
        {/* 사진 (TODO: 업로드 연결) */}
        <button
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400"
          aria-label="사진 추가"
        >
          {card.photoUrl ? (
            <img
              src={card.photoUrl}
              alt={card.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            "📷"
          )}
        </button>

        <div className="flex-1">
          {/* 이름 */}
          <input
            value={card.name}
            onChange={(e) => updateCard(card.id, { name: e.target.value })}
            className="w-full font-semibold text-zinc-900 outline-none"
            placeholder="name"
          />
          {/* 왼/른 퍼센트 텍스트 — 왼 값을 숫자로 입력하면 바가 자동 반영 */}
          <p className="flex items-center gap-1 text-sm text-zinc-500">
            왼
            <input
              value={card.leftPercent}
              onChange={(e) => setLeftPercent(e.target.value)}
              inputMode="numeric"
              className="w-8 border-b border-zinc-300 text-center font-bold text-zinc-900 outline-none focus:border-primary"
            />
            % | 른{" "}
            <span className="font-bold text-zinc-900">{rightPercent(card)}%</span>
          </p>
        </div>
      </div>

      {/* 퍼센트바 (읽기전용, 왼 퍼센트에 따라 자동 반영) */}
      <div className="mt-3">
        <PreferenceSlider leftPercent={card.leftPercent} />
      </div>

      {/* 코멘트 */}
      <input
        value={card.comment ?? ""}
        onChange={(e) => updateCard(card.id, { comment: e.target.value })}
        className="mt-3 w-full rounded-md border border-zinc-200 px-2 py-1 text-sm outline-none focus:border-primary"
        placeholder="+ 코멘트 추가"
      />
    </Card>
  );
}
