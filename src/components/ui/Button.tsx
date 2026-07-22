import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  outline:
    "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
};

/** 공통 버튼. 시안의 파란 버튼(+ new, Done!)과 아웃라인 버튼(+ 칸 추가)에 사용 */
export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-40 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
