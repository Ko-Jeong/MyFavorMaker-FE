import { type ReactNode } from "react";

/**
 * 모바일 프레임.
 * - 390px보다 좁은 화면: 기기 폭에 꽉 차게(full-bleed)
 * - 390px보다 넓은 화면: 항상 390px에 고정
 */
export default function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full justify-center">
      <div className="relative flex min-h-full w-full flex-col bg-background max-w-[var(--app-width)]">
        {children}
      </div>
    </div>
  );
}
