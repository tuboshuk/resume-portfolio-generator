import Link from "next/link";
import { cn } from "@/lib/cn";

export function PrimaryLink(props: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  external?: boolean;
  download?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors";
  const primary = "bg-indigo-500 text-white hover:bg-indigo-400";
  const secondary =
    "border border-white/15 bg-white/5 text-white hover:bg-white/10";
  const className = cn(
    base,
    props.variant === "secondary" ? secondary : primary,
    props.className,
  );

  if (props.external) {
    return (
      <a
        className={className}
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.label}
      </a>
    );
  }

  if (props.download) {
    return (
      <a className={className} href={props.href} download>
        {props.label}
      </a>
    );
  }

  return (
    <Link className={className} href={props.href}>
      {props.label}
    </Link>
  );
}
