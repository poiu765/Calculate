import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "rounded-md px-4 py-2 text-sm font-semibold transition",
        "bg-black text-white hover:opacity-90 active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
