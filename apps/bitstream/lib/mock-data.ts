import type { Room, Message, User, VideoCall } from "@/lib/types"

// Mock user data
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@company.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@company.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@company.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-4",
    name: "Alice Williams",
    email: "alice@company.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-5",
    name: "Charlie Brown",
    email: "charlie@company.com",
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Mock room data
export const mockRooms: Room[] = [
  {
    id: "room-1",
    name: "Main Hall",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    createdBy: "user-1",
    members: ["user-1", "user-2", "user-3", "user-4", "user-5"],
    isMainHall: true,
  },
  {
    id: "room-2",
    name: "Marketing Team",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    createdBy: "user-2",
    members: ["user-1", "user-2", "user-4"],
    isMainHall: false,
  },
  {
    id: "room-3",
    name: "Development Team",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    createdBy: "user-3",
    members: ["user-1", "user-3", "user-5"],
    isMainHall: false,
  },
]

// Mock message data
export const mockMessages: Record<string, Message[]> = {
  "room-1": [
    {
      id: "msg-1",
      roomId: "room-1",
      content: "Welcome to the Main Hall everyone!",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      sender: {
        id: "user-1",
        name: "John Doe",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2",
      roomId: "room-1",
      content: "Thanks for setting this up, John!",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
      sender: {
        id: "user-2",
        name: "Jane Smith",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-3",
      roomId: "room-1",
      content: "Looking forward to collaborating with everyone here.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sender: {
        id: "user-3",
        name: "Bob Johnson",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-4",
      roomId: "room-1",
      content: "Don't forget about our team meeting tomorrow at 10 AM!",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      sender: {
        id: "user-4",
        name: "Alice Williams",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
  "room-2": [
    {
      id: "msg-5",
      roomId: "room-2",
      content: "Hey marketing team! Let's discuss the new campaign.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sender: {
        id: "user-2",
        name: "Jane Smith",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-6",
      roomId: "room-2",
      content: "I've prepared some mockups, will share them soon.",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      sender: {
        id: "user-4",
        name: "Alice Williams",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-7",
      roomId: "room-2",
      content: "Great! I'm looking forward to seeing them.",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      sender: {
        id: "user-1",
        name: "John Doe",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
  "room-3": [
    {
      id: "msg-8",
      roomId: "room-3",
      content: "Dev team, we need to fix that bug in production ASAP.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sender: {
        id: "user-3",
        name: "Bob Johnson",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-9",
      roomId: "room-3",
      content: "I'm on it. Will push a fix within an hour.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
      sender: {
        id: "user-5",
        name: "Charlie Brown",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-10",
      roomId: "room-3",
      content: "Let me know if you need any help with testing.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      sender: {
        id: "user-1",
        name: "John Doe",
        image: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
}

// Mock video call data
export const mockVideoCalls: Record<string, VideoCall> = {
  "room-1": {
    roomId: "room-1",
    active: false,
    startedAt: new Date(),
    startedBy: "user-1",
    participants: ["user-1"],
  },
  "room-2": {
    roomId: "room-2",
    active: false,
    startedAt: new Date(),
    startedBy: "user-2",
    participants: ["user-2"],
  },
  "room-3": {
    roomId: "room-3",
    active: false,
    startedAt: new Date(),
    startedBy: "user-3",
    participants: ["user-3"],
  },
}

// Current logged-in user
export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@company.com",
  image: "/placeholder.svg?height=40&width=40",
}

