import { Container } from "@/components/Container";
import { PrimaryLink } from "@/components/PrimaryLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="inner" />
      <main>
        <Container className="py-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="text-2xl font-semibold">页面不存在</div>
            <div className="mt-3 text-sm text-white/70">
              你访问的地址不存在或已被移除。
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryLink href="/" label="返回首页" variant="secondary" />
              <PrimaryLink href="/projects" label="查看作品集" />
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}

