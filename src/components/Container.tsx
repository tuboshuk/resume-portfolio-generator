import type { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

export function Container(
  props: PropsWithChildren<{ className?: string }>,
) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] px-6 sm:px-8",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

