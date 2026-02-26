"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

export function CopyButton(props: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const label = useMemo(() => (copied ? "已复制" : "复制"), [copied]);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white hover:bg-white/10",
        props.className,
      )}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(props.value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 900);
        } catch {
          setCopied(false);
        }
      }}
    >
      {label}
    </button>
  );
}

