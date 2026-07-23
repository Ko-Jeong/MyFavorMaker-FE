"use client";

import { useEffect, useState } from "react";

const swapExt = (url: string): string | null => {
  if (url.endsWith(".jpg")) return url.slice(0, -4) + ".jpeg";
  if (url.endsWith(".jpeg")) return url.slice(0, -5) + ".jpg";
  return null;
};

export default function MemberPhoto({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [cur, setCur] = useState<string | undefined>(src);
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    setCur(src);
    setSwapped(false);
  }, [src]);

  if (!cur) return null;

  return (
    <img
      src={cur}
      alt={alt}
      className={className}
      onError={() => {
        if (!swapped) {
          const other = swapExt(cur);
          if (other) {
            setCur(other);
            setSwapped(true);
            return;
          }
        }
        setCur(undefined);
      }}
    />
  );
}
