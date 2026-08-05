/**
 * 왼/른 퍼센트 바 (읽기전용 표시 전용).
 * 유저가 직접 드래그로 조절하는 요소가 아니라,
 * leftPercent 값(텍스트로 입력됨)에 따라 자동으로 채워지는 시각 요소입니다.
 */
export default function PreferenceSlider({
export default function RatioSlider({
  leftPercent,
}: {
  leftPercent: number;
}) {
  const clamped = Math.max(0, Math.min(100, leftPercent));
  const rightPercent = 100 - clamped;
  const isRightHigher = rightPercent > clamped;
  const isLeftHigher = clamped > rightPercent;
  const leftLabelClass = isLeftHigher
    ? "text-xs font-semibold text-primary"
    : "text-xs text-zinc-500";
  const rightLabelClass = isRightHigher
    ? "text-xs font-semibold text-primary"
    : "text-xs text-zinc-500";
  const fillPositionClass = isRightHigher ? "right-0" : "left-0";
  const fillWidth = `${isRightHigher ? rightPercent : clamped}%`;

  return (
    <div className="flex items-center gap-2">
      <span className={leftLabelClass}>왼</span>
      <div className="relative h-1 flex-1 rounded-full bg-zinc-200">
        <div
          className={`absolute top-0 h-full rounded-full bg-primary ${fillPositionClass}`}
          style={{ width: fillWidth }}
        />
      </div>
      <span className={rightLabelClass}>른</span>
    </div>
  );
}
