import Link from "next/link";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";
import { site } from "@/lib/content";

export function SiteHeader(props: { mode: "home" | "inner" }) {
  const anchor = (id: string) => (props.mode === "home" ? `#${id}` : `/#${id}`);
  const anchors = {
    skills: site.anchors?.skills ?? "skills",
    experience: site.anchors?.experience ?? "experience",
    contact: site.anchors?.contact ?? "contact",
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 text-sm font-semibold text-white",
            "hover:text-white/90",
          )}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
            {site.name.slice(0, 1)}
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm text-white/80">
          <a className="hover:text-white" href={anchor(anchors.skills)}>
            技能
          </a>
          <a className="hover:text-white" href={anchor(anchors.experience)}>
            经历
          </a>
          <a className="hover:text-white" href={anchor(anchors.contact)}>
            联系
          </a>
          <Link
            className="ml-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-semibold text-white hover:bg-white/10"
            href="/projects"
          >
            作品集
          </Link>
        </nav>
      </Container>
    </header>
  );
}
