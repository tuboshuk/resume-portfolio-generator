import { cn } from "@/lib/cn";

export function Tag(props: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80",
        props.className,
      )}
    >
      {props.label}
    </span>
  );
}

