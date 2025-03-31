import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { collection, query, where, getDocs, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

// This API route is called after a user signs in to ensure they're in the main hall
export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the main hall
    const mainHallQuery = query(collection(db, "rooms"), where("isMainHall", "==", true))

    const mainHallSnapshot = await getDocs(mainHallQuery)

    if (mainHallSnapshot.empty) {
      // Create main hall if it doesn't exist
      await addDoc(collection(db, "rooms"), {
        name: "Main Hall",
        createdAt: serverTimestamp(),
        createdBy: session.user.id,
        members: [session.user.id],
        isMainHall: true,
      })
    } else {
      // Add user to main hall if not already a member
      const mainHallDoc = mainHallSnapshot.docs[0]
      const mainHallData = mainHallDoc.data()

      if (!mainHallData.members.includes(session.user.id)) {
        await updateDoc(doc(db, "rooms", mainHallDoc.id), {
          members: [...mainHallData.members, session.user.id],
        })
      }
    }

    return NextResponse.json({ message: "Setup completed successfully" })
  } catch (error) {
    console.error("Error in setup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

