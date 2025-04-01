import type { Metadata } from "next"
import ProjectsHeader from "@/components/projects/projects-header"
import ProjectsTable from "@/components/projects/projects-table"

export const metadata: Metadata = {
  title: "Progetti | Bitrock Hours",
  description: "Gestione dei progetti aziendali",
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <ProjectsHeader />
      <ProjectsTable />
    </div>
  )
}

