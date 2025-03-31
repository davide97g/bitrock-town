import type { Metadata } from "next"
import TimeTrackingHeader from "@/components/time-tracking/time-tracking-header"
import TimeTrackingTable from "@/components/time-tracking/time-tracking-table"

export const metadata: Metadata = {
  title: "Consuntivazione | Bitrock Hours",
  description: "Gestione delle ore lavorate",
}

export default function TimeTrackingPage() {
  return (
    <div className="space-y-6">
      <TimeTrackingHeader />
      <TimeTrackingTable />
    </div>
  )
}

