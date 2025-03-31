import { currentUser } from "@/lib/mock-data"

// Mock auth function that returns a session with the current user
export const auth = async () => {
  return {
    user: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.image,
    },
  }
}

// Mock handlers for the API routes
export const handlers = {
  GET: async () => new Response(JSON.stringify({ ok: true })),
  POST: async () => new Response(JSON.stringify({ ok: true })),
}

