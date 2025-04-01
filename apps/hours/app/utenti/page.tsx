import type { Metadata } from "next"
import UsersHeader from "@/components/users/users-header"
import UsersTable from "@/components/users/users-table"

export const metadata: Metadata = {
  title: "Utenti | Bitrock Hours",
  description: "Gestione degli utenti aziendali",
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersTable />
    </div>
  )
}

