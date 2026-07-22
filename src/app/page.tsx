import Link from "next/link";

/**
 * [담당 A] 랜딩 (시안: "랜딩")
 * 채팅형 인트로 → CREATE YOURS 로 /charts 진입
 */
export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      {/* 채팅 영역 */}
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="max-w-[70%] self-start rounded-2xl bg-zinc-200 px-4 py-2 text-sm">
          너 왜 눈을 CP렇게 떠?
        </div>
        <div className="max-w-[70%] self-end rounded-2xl bg-primary px-4 py-2 text-sm text-white">
          설명해줄게
        </div>
        <div className="max-w-[70%] self-end rounded-2xl bg-primary px-4 py-2 text-sm text-white">
          ▶ ·ı|ııı|ıı·&nbsp;&nbsp;&nbsp;01:54:45
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-1 pb-10">
        <div className="rounded-full border border-zinc-300 px-5 py-2 font-title text-base">
          CREATE YOURS
        </div>
        <Link href="/charts" className="text-sm font-semibold text-primary">
          click!
        </Link>
      </div>
    </div>
  );
}
