import Link from "next/link";
import type { Project } from "@/lib/types";
import { Tag } from "@/components/Tag";
import { PlainImage } from "@/components/PlainImage";

export function ProjectCard(props: { project: Project; from?: string }) {
  const p = props.project;

  return (
    <Link
      href={`/projects/${p.slug}/${props.from ? `?from=${props.from}` : ""}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/7"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-white/5">
        <PlainImage
          alt={p.title}
          src={p.coverImageUrl}
          width={800}
          height={600}
          className="h-full w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-white">{p.title}</div>
            <div className="mt-1 text-sm text-white/65">{p.summary}</div>
          </div>
          <div className="shrink-0 text-xs font-semibold text-white/55">{p.period}</div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.slice(0, 4).map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
    </Link>
  );
}
