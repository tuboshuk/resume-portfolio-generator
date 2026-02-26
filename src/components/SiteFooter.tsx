import { Container } from "@/components/Container";
import { site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <Container className="py-10">
        <div className="flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} {site.name}</div>
          <div>Built with Next.js + TypeScript + Tailwind</div>
        </div>
      </Container>
    </footer>
  );
}

