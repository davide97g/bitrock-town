import type { Metadata } from "next"
import ProjectDetail from "@/components/projects/project-detail"

export const metadata: Metadata = {
  title: "Dettaglio Progetto | Bitrock Hours",
  description: "Visualizza i dettagli del progetto",
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <ProjectDetail id={params.id} />
    </div>
  )
}

