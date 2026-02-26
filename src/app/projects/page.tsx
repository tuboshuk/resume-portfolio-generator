import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectsClient } from "./projects-client";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <SiteHeader mode="inner" />
      <ProjectsClient />
      <SiteFooter />
    </div>
  );
}
