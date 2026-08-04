import { type ReactNode } from "react";

/** 시안의 흰색 라운드 카드 컨테이너 (그림자/보더) */
export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white px-4 pt-4 pb-[14px] shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
