type PreferenceSummaryProps = {
  leftPercent: number;
  rightPercent: number;
  editable?: boolean;
  onLeftPercentChange?: (value: string) => void;
};

export default function RatioSummary({
  leftPercent,
  rightPercent,
  editable = false,
  onLeftPercentChange,
}: PreferenceSummaryProps) {
  const isLeftHigher = leftPercent > rightPercent;
  const isRightHigher = rightPercent > leftPercent;
  const leftTextClass = isLeftHigher ? "font-bold text-zinc-500" : "text-zinc-500";
  const rightTextClass = isRightHigher ? "font-bold text-zinc-500" : "text-zinc-500";

  if (editable) {
    return (
      <p className="flex items-center gap-1 text-sm text-zinc-500">
        <span className={leftTextClass}>왼</span>
        <input
          value={leftPercent}
          onChange={(event) => onLeftPercentChange?.(event.target.value)}
          inputMode="numeric"
          className={`w-8 border-b border-zinc-300 text-center outline-none focus:border-primary ${leftTextClass}`}
        />
        <span className={leftTextClass}>%</span> | <span className={rightTextClass}>른</span>{" "}
        <span className={rightTextClass}>{rightPercent}%</span>
      </p>
    );
  }

  return (
    <p className="text-sm text-zinc-500">
      <span className={leftTextClass}>왼</span>{" "}
      <span className={leftTextClass}>{leftPercent}%</span> |{" "}
      <span className={rightTextClass}>른</span>{" "}
      <span className={rightTextClass}>{rightPercent}%</span>
    </p>
  );
}
