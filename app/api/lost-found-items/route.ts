import { NextResponse } from "next/server"
import { items } from "@/lib/storage"

export async function GET() {
  try {
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Failed to fetch items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}
