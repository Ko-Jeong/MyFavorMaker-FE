const DEFAULT_MAX_SIZE = 360;
const DEFAULT_QUALITY = 0.72;
const DEFAULT_MAX_BYTES = 180 * 1024;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.08;

const optimizedImageCache = new Map<string, Promise<string>>();

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });

const dataUrlBytes = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  if (!base64) return 0;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

const renderOptimizedDataUrl = (
  image: HTMLImageElement,
  width: number,
  height: number,
  quality: number,
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return "";

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
};

/**
 * 이미지의 긴 변을 제한해 브라우저 캔버스와 내보내기 이미지의 용량을 줄입니다.
 * 로딩/변환에 실패하면 원본을 반환해 이미지 자체가 사라지지 않도록 합니다.
 */
export const optimizeImageSource = (
  src: string,
  maxSize = DEFAULT_MAX_SIZE,
  quality = DEFAULT_QUALITY,
): Promise<string> => {
  const cached = optimizedImageCache.get(src);
  if (cached) return cached;

  const optimized = loadImage(src)
    .then((image) => {
      const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
      const scale = Math.min(1, maxSize / longestSide);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      let currentQuality = quality;
      let optimizedSrc = renderOptimizedDataUrl(image, width, height, currentQuality);
      if (!optimizedSrc) return src;

      while (
        dataUrlBytes(optimizedSrc) > DEFAULT_MAX_BYTES &&
        currentQuality > MIN_QUALITY
      ) {
        currentQuality = Math.max(MIN_QUALITY, currentQuality - QUALITY_STEP);
        optimizedSrc = renderOptimizedDataUrl(
          image,
          width,
          height,
          currentQuality,
        );
        if (!optimizedSrc) return src;
      }

      return optimizedSrc;
    })
    .catch(() => src);

  optimizedImageCache.set(src, optimized);
  return optimized;
};
