"use client";

import { useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { currentUser, mockUsers } from "@/lib/mock-data";
import type { User } from "@/lib/types";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  currentMembers: string[];
}

export default function InviteUserDialog({
  open,
  onOpenChange,
  roomId,
  currentMembers,
}: InviteUserDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all users
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        // Filter out current user and users already in the room
        const availableUsers = mockUsers.filter(
          (user) =>
            user.id !== currentUser.id && !currentMembers.includes(user.id),
        );

        setUsers(availableUsers);
        setFilteredUsers(availableUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [open, currentMembers, toast]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query),
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleInviteUser = async (userId: string) => {
    if (!roomId) return;

    try {
      // Update room members by adding the invited user
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        members: arrayUnion(userId),
      });

      // Find the invited user's name
      const invitedUser = users.find((user) => user.id === userId);

      toast({
        title: "User invited",
        description: `${invitedUser?.name || "User"} has been invited to the room.`,
      });

      // Remove invited user from the list
      setUsers(users.filter((user) => user.id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error inviting user:", error);
      toast({
        title: "Error",
        description: "Failed to invite user.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite users</DialogTitle>
          <DialogDescription>
            Invite team members to join this room.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Icons.spinner className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {users.length === 0
                  ? "No users available to invite"
                  : "No users match your search"}
              </p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleInviteUser(user.id)}>
                    Invite
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
