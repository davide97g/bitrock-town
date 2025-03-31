"use client";

import { useEffect, useState } from "react";

import CreateRoomDialog from "@/components/create-room-dialog";
import RoomsList from "@/components/rooms-list";
import { Sidebar } from "@/components/sidebar";
import { db } from "@/lib/firebase";
import { currentUser } from "@/lib/mock-data";
import type { Room } from "@/lib/types";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export default function DashboardLayout() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  useEffect(() => {
    // Query rooms where the user is a member
    const roomsQuery = query(
      collection(db, "rooms"),
      where("members", "array-contains", currentUser.id),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
      const roomsData: Room[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        roomsData.push({
          id: doc.id,
          name: data.name,
          createdAt: data.createdAt,
          createdBy: data.createdBy,
          members: data.members,
          isMainHall: data.isMainHall || false,
        });
      });
      setRooms(roomsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Rooms</h1>
          <button
            onClick={() => setIsCreateRoomOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            <span>Create Room</span>
          </button>
        </div>
        <RoomsList rooms={rooms} />
        <CreateRoomDialog
          open={isCreateRoomOpen}
          onOpenChange={setIsCreateRoomOpen}
        />
      </main>
    </div>
  );
}
