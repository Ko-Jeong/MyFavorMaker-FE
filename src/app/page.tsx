import Link from "next/link";
import { Play } from "lucide-react";

function Bubble({
  src,
  alt,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <img src={src} alt={alt} className="h-full w-full" />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="screen-pad flex flex-1 flex-col justify-center">
      <div className="flex flex-col gap-5">
        <Bubble
          src="/landing/left-bubble.svg"
          alt=""
          className="h-[36px] w-[195px] self-start"
        >
          <div className="flex h-full w-full items-center justify-center whitespace-nowrap px-3 text-center text-[16px] text-black">
            <span className="translate-x-1">너 왜 눈을 CP렇게 떠?</span>
          </div>
        </Bubble>

        <div className="flex flex-col items-end gap-2">
          <Bubble
            src="/landing/right-bubble-1.svg"
            alt=""
            className="h-[36px] w-[114px]"
          >
            <div className="flex h-full w-full items-center justify-center whitespace-nowrap px-3 text-center text-[16px] text-white">
              <span className="-translate-x-0.5">설명해줄게</span>
            </div>
          </Bubble>

          <Bubble
            src="/landing/right-bubble-2.svg"
            alt=""
            className="h-[54px] w-[224px]"
          >
            <div className="flex h-full w-full items-center justify-center px-5 text-white">
              <div className="-translate-x-2.5 flex items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                  <Play className="h-4 w-4 fill-primary text-primary" />
                </span>
                <div className="ml-3 flex items-center gap-3">
                  <img
                    src="/landing/waveform.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-[86px]"
                  />
                  <span className="text-[14px] opacity-66">01:54:45</span>
                </div>
              </div>
            </div>
          </Bubble>
        </div>

        <div className="mt-6 flex flex-col items-center gap-1">
          <div className="rounded-[50px] bg-[#E6E5EB]/30 px-6 py-1 font-title text-[20px] text-[#414141]">
            CREATE YOURS
          </div>
          <Link href="/charts" className="font-title text-[17px] text-primary">
            click!
          </Link>
        </div>
      </div>
    </div>
  );
}
