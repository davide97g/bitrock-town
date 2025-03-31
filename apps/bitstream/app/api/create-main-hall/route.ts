import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

// This API route creates the main hall room if it doesn't exist
export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if main hall already exists
    const mainHallQuery = query(collection(db, "rooms"), where("isMainHall", "==", true))

    const mainHallSnapshot = await getDocs(mainHallQuery)

    if (!mainHallSnapshot.empty) {
      return NextResponse.json({ message: "Main hall already exists" })
    }

    // Create main hall room
    await addDoc(collection(db, "rooms"), {
      name: "Main Hall",
      createdAt: serverTimestamp(),
      createdBy: session.user.id,
      members: [session.user.id], // Start with current user
      isMainHall: true,
    })

    return NextResponse.json({ message: "Main hall created successfully" })
  } catch (error) {
    console.error("Error creating main hall:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

