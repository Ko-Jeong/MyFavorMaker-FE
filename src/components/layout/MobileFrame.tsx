import { type ReactNode } from "react";

/**
 * 모바일 프레임.
 * - 실제 폰(작은 화면): 기기 폭에 꽉 차게(full-bleed) → 어떤 폰이든 동일한 유동 레이아웃
 * - 노트북/큰 화면(sm 이상): 390px 폰 크기로 고정
 * 즉 폭은 기기에 맞춰 유동적이되, 큰 화면에서만 폰처럼 고정됩니다.
 */
export default function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full justify-center">
      <div className="relative flex min-h-full w-full flex-col bg-background sm:max-w-[var(--app-width)]">
        {children}
      </div>
    </div>
  );
}
