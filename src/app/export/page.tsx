"use client";

import Link from "next/link";
import { Download, Minus, Minimize2, Plus } from "lucide-react";
import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardView from "@/components/chart/CharacterCardView";

const CAPTURE_WIDTH = 780;

function ExportCaptureContent() {
  const { chart } = useChartStore();
  const leftColumnCards = chart.cards.filter((_, index) => index % 2 === 0);
  const rightColumnCards = chart.cards.filter((_, index) => index % 2 === 1);

  return (
    <div className="w-[780px] bg-white px-6 py-5 text-zinc-900">
      <p className="mb-4 text-[28px] font-bold">{chart.title}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {leftColumnCards.map((card) => (
            <CharacterCardView key={card.id} card={card} shadow={false} />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {rightColumnCards.map((card) => (
            <CharacterCardView key={card.id} card={card} shadow={false} />
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-zinc-400">cpmaker.vercel.app</p>
    </div>
  );
}

export default function ExportPage() {
  const { chart } = useChartStore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const shareText = "cpmaker.vercel.app";

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

    setSupportsNativeShare(typeof navigator.share === "function" && isTouchDevice);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const generateImage = async () => {
      if (!captureRef.current) {
        return;
      }

      setIsGenerating(true);

      try {
        await document.fonts.ready;
        const nextImageUrl = await toPng(captureRef.current, {
          backgroundColor: "#ffffff",
          cacheBust: true,
          pixelRatio: 2,
          width: CAPTURE_WIDTH,
        });

        if (!cancelled) {
          setImageUrl(nextImageUrl);
        }
      } catch (error) {
        console.error("Failed to generate export image", error);
        if (!cancelled) {
          setImageUrl(null);
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    };

    void generateImage();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  const handleSave = () => {
    if (!imageUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${chart.title || "my-chart"}.png`;
    link.click();
  };

  const handleShareX = async () => {
    if (!imageUrl) {
      return;
    }

    if (supportsNativeShare) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${chart.title || "my-chart"}.png`, {
          type: "image/png",
        });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            text: shareText,
            title: chart.title || "나의 취향표",
          });
          return;
        }
      } catch (error) {
        console.error("Failed to share export image", error);
      }
    }

    const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenPreview = () => {
    if (!imageUrl) {
      return;
    }

    setPreviewScale(1);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewScale(1);
  };

  const handleZoomOut = () => {
    setPreviewScale((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(2))));
  };

  const handleZoomIn = () => {
    setPreviewScale((prev) => Math.min(2, Number((prev + 0.1).toFixed(2))));
  };

  return (
    <div className="screen-pad select-none flex flex-1 flex-col">
      <h1 className="font-title text-[30px]">취향표 저장과 공유</h1>
      <p className="mt-2 text-sm text-zinc-500">이미지를 눌러 확인해 보세요</p>

      {isGenerating ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-2" aria-hidden="true">
              <span
                className="h-2.5 w-2.5 rounded-full bg-zinc-400"
                style={{ animation: "loadingDotBounce 1.2s ease-in-out infinite" }}
              />
              <span
                className="h-2.5 w-2.5 rounded-full bg-zinc-400"
                style={{
                  animation: "loadingDotBounce 1.2s ease-in-out infinite",
                  animationDelay: "0.15s",
                }}
              />
              <span
                className="h-2.5 w-2.5 rounded-full bg-zinc-400"
                style={{
                  animation: "loadingDotBounce 1.2s ease-in-out infinite",
                  animationDelay: "0.3s",
                }}
              />
            </span>
            <span className="text-base">이미지 생성 중</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="block overflow-hidden rounded-[10px]"
            aria-label="내보내기 이미지 미리보기 열기"
          >
            {imageUrl ? (
            <img
              src={imageUrl}
              alt="취향표 미리보기 이미지"
              className="w-full max-w-full"
            />
          ) : (
            <div className="flex aspect-[780/430] w-full min-w-0 max-w-full items-center justify-center">
              <span className="text-sm text-zinc-400">이미지를 만들지 못했어요</span>
            </div>
            )}
          </button>
        </div>
      )}

      <div className="mt-auto border-t border-dashed border-zinc-300 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-6">
        <div className="flex items-center justify-between text-sm font-medium">
          <Link href="/preview" className="inline-flex items-center gap-1.5 text-[16px] text-zinc-500">
            <img
              src="/icons/nav-left.svg"
              alt=""
              aria-hidden="true"
              className="h-4.3 w-4.3"
            />
            이전
          </Link>
          <span aria-hidden="true" className="w-[72px]" />
        </div>

        <div className="mt-6 flex justify-center gap-10">
          <button
            onClick={handleSave}
            aria-label="취향표 저장"
            disabled={!imageUrl}
            className="flex flex-col items-center gap-2 text-center text-[13px] leading-[1.35] text-zinc-700 disabled:opacity-40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
              <Download className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span>
              취향표
              <br />
              저장
            </span>
          </button>
          <button
            type="button"
            onClick={() => void handleShareX()}
            aria-label="X로 공유하기"
            disabled={!imageUrl}
            className="flex flex-col items-center gap-2 text-center text-[13px] leading-[1.35] text-zinc-700 disabled:opacity-40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <img src="/icons/x.svg" alt="" aria-hidden="true" className="h-4.5 w-4.5" />
            </span>
            <span>
              X로
              <br />
              공유하기
            </span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none fixed -left-[9999px] top-0 opacity-0">
        <div ref={captureRef}>
          <ExportCaptureContent />
        </div>
      </div>

      {isPreviewOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/55 p-6"
          onClick={handleClosePreview}
        >
          <div className="flex min-h-full items-center justify-center">
            <div className="flex w-fit max-w-full flex-col items-center gap-6">
              <div className="flex max-h-[calc(100vh-220px)] max-w-full items-center justify-center overflow-hidden">
                <img
                  src={imageUrl}
                  alt="확대된 취향표 이미지"
                  onClick={(event) => event.stopPropagation()}
                  className="h-auto max-h-[calc(100vh-220px)] w-auto max-w-[min(960px,100%)] rounded-[24px] bg-white object-contain shadow-2xl transition-transform duration-200"
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>

              <div
                className="flex items-center overflow-hidden rounded-[10px] bg-black/70 text-white"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="flex h-8 w-9 items-center justify-end pr-1.5 disabled:opacity-40"
                  disabled={previewScale <= 0.5}
                  aria-label="축소"
                >
                  <Minus className="h-3.5 w-3.5" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(1)}
                  className="flex h-8 min-w-[52px] items-center justify-center px-1 text-[15px] font-medium"
                  aria-label="배율 초기화"
                >
                  {Math.round(previewScale * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="flex h-8 w-9 items-center justify-start pl-1.5 disabled:opacity-40"
                  disabled={previewScale >= 2}
                  aria-label="확대"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="flex 9 w-9 items-center justify-center border-l border-white/15"
                  aria-label="미리보기 닫기"
                >
                  <Minimize2 className="h-3.5 w-3.5" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
