"use client";

import { useState } from "react";

const swapExt = (url: string): string | null => {
  if (url.endsWith(".jpg")) return url.slice(0, -4) + ".jpeg";
  if (url.endsWith(".jpeg")) return url.slice(0, -5) + ".jpg";
  return null;
};

export default function MemberPhoto({
  src,
  alt,
  className = "",
  loading,
  decoding,
  fetchPriority,
}: {
  src?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
}) {
  if (!src) return null;

  return (
    <MemberPhotoImage
      key={src}
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
    />
  );
}

function MemberPhotoImage({
  src,
  alt,
  className,
  loading,
  decoding,
  fetchPriority,
}: {
  src?: string;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const [cur, setCur] = useState<string | undefined>(src);
  const [swapped, setSwapped] = useState(false);

  if (!cur) return null;

  return (
    <img
      src={cur}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
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
