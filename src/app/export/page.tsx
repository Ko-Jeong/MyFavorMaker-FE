"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, Minus, Minimize2, Plus, RotateCcw } from "lucide-react";
import { toBlob } from "html-to-image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChartStore } from "@/store/useChartStore";
import CharacterCardView from "@/components/chart/CharacterCardView";
import PageNavigation from "@/components/ui/PageNavigation";
import { type CharacterCard } from "@/types/chart";
import {
  getChartEntryHref,
  getChartEntrySource,
} from "@/lib/chart-entry";

const CAPTURE_WIDTH = 780;
const EXPORT_IMAGE_EXTENSION = "jpg";

const waitForImages = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    images.map((image) => {
      if (image.complete && image.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const finish = () => {
          if (!image.complete || image.naturalWidth === 0) {
            return;
          }

          image.removeEventListener("load", finish);
          image.removeEventListener("error", fail);
          resolve();
        };

        const fail = () => {
          image.removeEventListener("load", finish);
          image.removeEventListener("error", fail);
          resolve();
        };

        image.addEventListener("load", finish);
        image.addEventListener("error", fail, { once: true });
      });
    }),
  );

  await Promise.all(
    images.map((image) =>
      typeof image.decode === "function"
        ? image.decode().catch(() => undefined)
        : Promise.resolve(),
    ),
  );
};

const createExportBlob = async (node: HTMLElement) => {
  let lastError: unknown;

  for (const { pixelRatio, quality } of [
    { pixelRatio: 2, quality: 0.9 },
    { pixelRatio: 1.5, quality: 0.85 },
  ]) {
    try {
      const blob = await toBlob(node, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio,
        width: CAPTURE_WIDTH,
        type: "image/jpeg",
        quality,
      });

      if (blob) return blob;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Export image blob was not created");
};

function splitCardsByColumns(cards: CharacterCard[]) {
  return cards.reduce<[CharacterCard[], CharacterCard[]]>(
    (columns, card, index) => {
      columns[index % 2].push(card);
      return columns;
    },
    [[], []],
  );
}

function PreviewControls({
  previewScale,
  onZoomOut,
  onReset,
  onZoomIn,
  onClose,
}: {
  previewScale: number;
  onZoomOut: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="flex items-center overflow-hidden rounded-[10px] bg-black/70 text-white"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={onZoomOut}
        className="flex h-8 w-9 items-center justify-end pr-1.5 disabled:opacity-40"
        disabled={previewScale <= 0.5}
        aria-label="축소"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.4} />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex h-8 min-w-[52px] items-center justify-center px-1 text-[15px] font-medium"
        aria-label="배율 초기화"
      >
        {Math.round(previewScale * 100)}%
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="flex h-8 w-9 items-center justify-start pl-1.5 disabled:opacity-40"
        disabled={previewScale >= 2}
        aria-label="확대"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-9 items-center justify-center border-l border-white/15"
        aria-label="미리보기 닫기"
      >
        <Minimize2 className="h-3.5 w-3.5" strokeWidth={2.4} />
      </button>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-2" aria-hidden="true">
      <span
        className="h-2.5 w-2.5 rounded-full bg-zinc-400"
        style={{ animation: "loadingDotBounce 1.35s ease-in-out infinite" }}
      />
      <span
        className="h-2.5 w-2.5 rounded-full bg-zinc-400"
        style={{
          animation: "loadingDotBounce 1.35s ease-in-out infinite",
          animationDelay: "0.16s",
        }}
      />
      <span
        className="h-2.5 w-2.5 rounded-full bg-zinc-400"
        style={{
          animation: "loadingDotBounce 1.35s ease-in-out infinite",
          animationDelay: "0.32s",
        }}
      />
    </span>
  );
}

function ExportCaptureContent() {
  const { chart } = useChartStore();
  const [leftColumnCards, rightColumnCards] = splitCardsByColumns(chart.cards);

  return (
    <div className="w-[780px] bg-white px-6 py-5 text-zinc-900">
      <p className="page-title mb-4">{chart.title}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {leftColumnCards.map((card) => (
            <CharacterCardView
              key={card.id}
              card={card}
              shadow={false}
              imageLoading="eager"
              imageDecoding="sync"
              imageFetchPriority="high"
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {rightColumnCards.map((card) => (
            <CharacterCardView
              key={card.id}
              card={card}
              shadow={false}
              imageLoading="eager"
              imageDecoding="sync"
              imageFetchPriority="high"
            />
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-zinc-400">cp-maker.vercel.app</p>
    </div>
  );
}

function ExportPageContent() {
  const { chart } = useChartStore();
  const searchParams = useSearchParams();
  const captureRef = useRef<HTMLDivElement>(null);
  const imageUrlRef = useRef<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [supportsNativeShare] = useState(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return false;
    }

    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

    return typeof navigator.share === "function" && isTouchDevice;
  });
  const [previewScale, setPreviewScale] = useState(1);
  const shareText = "cp-maker.vercel.app";
  const source = getChartEntrySource(searchParams.get("source"));
  const groupId = searchParams.get("group");
  const previewHref = getChartEntryHref("/preview", source, groupId ?? undefined);

  useEffect(() => {
    let cancelled = false;

    const generateImage = async () => {
      if (!captureRef.current) {
        return;
      }

      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
      setImageUrl(null);
      setIsGenerating(true);

      try {
        await document.fonts.ready;
        await waitForImages(captureRef.current);
        const imageBlob = await createExportBlob(captureRef.current);

        const nextImageUrl = URL.createObjectURL(imageBlob);

        if (!cancelled) {
          imageUrlRef.current = nextImageUrl;
          setImageUrl(nextImageUrl);
        } else {
          URL.revokeObjectURL(nextImageUrl);
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

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  const handleSave = () => {
    if (!imageUrl) {
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${chart.title || "my-chart"}.${EXPORT_IMAGE_EXTENSION}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to save export image", error);
    }
  };

  const handleShareX = async () => {
    if (!imageUrl) {
      return;
    }

    if (supportsNativeShare) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File(
          [blob],
          `${chart.title || "my-chart"}.${EXPORT_IMAGE_EXTENSION}`,
          { type: "image/jpeg" },
        );

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
      <h1 className="page-title">취향표 저장과 공유</h1>
      <p className="mt-2 text-sm text-zinc-500">이미지를 꾹 눌러 저장할 수 있어요</p>

      {isGenerating ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-zinc-400">
            <LoadingDots />
            <span className="text-base">이미지 생성 중</span>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex justify-center">
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

          <div className="mt-13 border-t border-dashed border-zinc-300 pt-13">
            <div className="flex justify-center gap-10">
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

            <div className="mt-5 flex justify-center">
              <Link
                href="/charts"
                className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500"
              >
                <RotateCcw className="h-3 w-3" strokeWidth={2.2} />
                다시 하기
              </Link>
            </div>
          </div>
        </div>
      )}
      <PageNavigation previous={{ href: previewHref, label: "이전" }} />

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

              <PreviewControls
                previewScale={previewScale}
                onZoomOut={handleZoomOut}
                onReset={() => setPreviewScale(1)}
                onZoomIn={handleZoomIn}
                onClose={handleClosePreview}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="flex flex-1" />}>
      <ExportPageContent />
    </Suspense>
  );
}
