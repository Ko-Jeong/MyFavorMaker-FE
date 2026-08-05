"use client";

import Link from "next/link";

type NavigationItem = {
  href: string;
  label: "이전" | "다음";
};

export default function PageNavigation({
  previous,
  next,
  withTopBorder = false,
}: {
  previous?: NavigationItem;
  next?: NavigationItem;
  withTopBorder?: boolean;
}) {
  return (
    <div
      className={`${withTopBorder ? "border-t border-dashed border-zinc-300" : ""} mt-auto pb-[calc(env(safe-area-inset-bottom)+12px)] pt-6`}
    >
      <div className="flex items-center justify-between text-sm font-medium">
        {previous ? (
          <Link
            href={previous.href}
            className="inline-flex items-center gap-1.5 text-[16px] text-zinc-500"
          >
            <img
              src="/icons/nav-left.svg"
              alt=""
              aria-hidden="true"
              className="h-4.3 w-4.3"
            />
            {previous.label}
          </Link>
        ) : (
          <span aria-hidden="true" className="w-[72px]" />
        )}

        {next ? (
          <Link
            href={next.href}
            className="inline-flex items-center gap-1.5 text-[16px] text-zinc-500"
          >
            {next.label}
            <img
              src="/icons/nav-right.svg"
              alt=""
              aria-hidden="true"
              className="h-4.3 w-4.3"
            />
          </Link>
        ) : (
          <span aria-hidden="true" className="w-[72px]" />
        )}
      </div>
    </div>
  );
}
