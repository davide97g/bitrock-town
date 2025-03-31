export interface User {
  id: string
  name: string
  email: string
  image?: string
}

export interface Room {
  id: string
  name: string
  createdAt: Date
  createdBy: string
  members: string[]
  isMainHall?: boolean
}

export interface Message {
  id: string
  roomId: string
  content: string
  createdAt: Date
  sender: {
    id: string
    name: string
    image?: string
  }
}

export interface VideoCall {
  roomId: string
  active: boolean
  startedAt: Date
  startedBy: string
  participants: string[]
}

