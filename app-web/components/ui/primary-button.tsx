import type { ReactNode, ButtonHTMLAttributes } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils/cn";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  showArrow?: boolean;
}

export function PrimaryButton({ children, showArrow = true, className, ...props }: PrimaryButtonProps) {
  return (
    <button className={cn("primary-action", className)} type="button" {...props}>
      {children}
      {showArrow && <ArrowRight aria-hidden />}
    </button>
  );
}
