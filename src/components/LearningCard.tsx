import { cn } from "@/lib/cn";
import type { LearningNote } from "@/lib/types";
import { Tag } from "@/components/Tag";
import { PrimaryLink } from "@/components/PrimaryLink";

export function LearningCard(props: { note: LearningNote }) {
  const note = props.note;
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6",
        "transition-colors hover:bg-white/7",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-2">
          <div className="text-base font-semibold leading-6">{note.title}</div>
          <div className="text-xs font-semibold text-white/55">{note.date}</div>
        </div>
        {note.featured ? (
          <div className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-white/80">
            推荐
          </div>
        ) : null}
      </div>

      <div className="mt-3 text-sm leading-6 text-white/65">{note.summary}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {note.tags.map((t) => (
          <Tag key={`${note.slug}-${t}`} label={t} />
        ))}
      </div>

      {note.links.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {note.links.map((l) => (
            <PrimaryLink
              key={`${note.slug}-${l.href}`}
              href={l.href}
              label={l.label}
              variant="secondary"
              external
              className="h-10 px-4"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

