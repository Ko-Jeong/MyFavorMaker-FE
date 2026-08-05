import { type CharacterCard, rightPercent } from "@/types/chart";
import PreferenceSlider from "@/components/ui/PreferenceSlider";
import Card from "@/components/ui/Card";
import MemberPhoto from "@/components/chart/MemberPhoto";

/**
 * 읽기전용 카드 (미리보기 / 내보내기 화면).
 * 구성: 사진 · 이름 · 왼/른 퍼센트 텍스트 · 퍼센트바 · 코멘트
 */
export default function CharacterCardView({
  card,
  className = "",
  shadow = true,
}: {
  card: CharacterCard;
  className?: string;
  shadow?: boolean;
}) {
  const right = rightPercent(card);
  const comment = card.comment?.trim() ?? "";

  return (
    <Card className={className} shadow={shadow}>
      <div className="flex items-center gap-3">
        {/* 사진 */}
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-200">
          <MemberPhoto
            src={card.photoUrl}
            alt={card.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          {/* 이름 */}
          <p className="font-bold text-zinc-900">{card.name}</p>
          {/* 왼/른 퍼센트 텍스트 */}
          <p className="text-sm text-zinc-500">
            왼 <span className="font-bold text-zinc-500">{card.leftPercent}%</span> | 른{" "}
            <span className="font-bold text-zinc-500">{right}%</span>
          </p>
        </div>
      </div>

      {/* 퍼센트바 */}
      <div className="mt-3">
        <PreferenceSlider leftPercent={card.leftPercent} />
      </div>

      {/* 코멘트 */}
      <p
        className={`mt-3 min-h-[20px] whitespace-pre-wrap text-sm text-zinc-600 ${
          comment ? "" : "invisible"
        }`}
      >
        {comment || "placeholder"}
      </p>
    </Card>
  );
}
