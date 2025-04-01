import type { Metadata } from "next"
import UserDetail from "@/components/users/user-detail"

export const metadata: Metadata = {
  title: "Dettaglio Utente | Bitrock Hours",
  description: "Visualizza i dettagli dell'utente",
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <UserDetail id={params.id} />
    </div>
  )
}

