import RoomPage from "@/components/room-page"

export default function Room({ params }: { params: { id: string } }) {
  return <RoomPage roomId={params.id} />
}

