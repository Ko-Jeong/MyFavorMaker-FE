import Link from "next/link";
import { Play } from "lucide-react";

/* 음성 메시지 파형 */
const WAVE_BARS = [6, 11, 16, 9, 14, 19, 12, 17, 8, 4];
function Waveform() {
  return (
    <div className="flex items-center gap-[4px]">
      {WAVE_BARS.map((h, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-white opacity-66"
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

/**
 * 랜딩 페이지
 */
export default function LandingPage() {
  return (
    <Link
      href="/charts"
      className="screen-pad flex flex-1 flex-col justify-center"
    >
      <div className="flex flex-col gap-3">
        <div className="max-w-[78%] self-start rounded-3xl bg-[#E6E5EB] px-5 py-2 text-[17px]">
          너 왜 눈을 CP렇게 떠?
        </div>
        <div className="max-w-[78%] self-end rounded-4xl bg-primary px-5 py-2 text-[17px] text-white">
          설명해줄게
        </div>
        <div className="flex max-w-[78%] items-center gap-3 self-end rounded-4xl bg-primary px-4 py-3 text-[17px] text-white">
          {/* 재생 버튼 아이콘 */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
            <Play className="h-4 w-4 fill-primary text-primary" />
          </span>
          {/* 음성 파형 */}
          <Waveform />
          <span className="text-sm opacity-66">01:54:45</span>
        </div>

        <div className="mt-6 flex flex-col items-center gap-1">
          <div className="rounded-[50px] bg-[#E6E5EB]/30 px-6 py-1 font-title text-[20px] text-[#414141]">
            CREATE YOURS
          </div>
          <span className="font-title text-[17px] text-primary">click!</span>
        </div>
      </div>
    </Link>
  );
}
