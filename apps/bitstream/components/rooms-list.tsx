"use client";

import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Room } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface RoomsListProps {
  rooms: Room[];
}

export default function RoomsList({ rooms }: RoomsListProps) {
  const router = useRouter();

  const handleRoomClick = (roomId: string) => {
    router.push(`/dashboard/room/${roomId}`);
  };

  if (rooms.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No rooms available. Create one to get started!
        </p>
      </div>
    );
  }

  // Sort rooms to show main hall first
  const sortedRooms = [...rooms].sort((a, b) => {
    if (a.isMainHall) return -1;
    if (b.isMainHall) return 1;
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedRooms.map((room) => (
        <Card
          key={room.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleRoomClick(room.id)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              {room.isMainHall ? (
                <Icons.users className="h-5 w-5 text-primary" />
              ) : (
                <Icons.chat className="h-5 w-5 text-primary" />
              )}
              {room.name}
            </CardTitle>
            <CardDescription>
              {room.isMainHall
                ? "Main company chat room"
                : `Created ${formatDistanceToNow((room.createdAt as unknown as Timestamp | undefined)?.toDate() ?? new Date(), { addSuffix: true })}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              {room.members.length}{" "}
              {room.members.length === 1 ? "member" : "members"}
            </p>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icons.chat className="h-3 w-3" />
              <span>Chat available</span>
              <Icons.video className="h-3 w-3 ml-2" />
              <span>Video available</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
