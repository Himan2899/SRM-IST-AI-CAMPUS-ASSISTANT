import { type NextRequest, NextResponse } from "next/server"
import { items } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const contactInfo = formData.get("contactInfo") as string
    const type = formData.get("type") as "lost" | "found"
    const image = formData.get("image") as File

    if (!title || !description || !location || !contactInfo || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const imageBuffer = await image.arrayBuffer()
    const imageBase64 = `data:${image.type};base64,${Buffer.from(imageBuffer).toString("base64")}`

    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      location,
      contactInfo,
      status: type,
      dateReported: new Date().toISOString(),
      reportedBy: "Current User",
      imageUrl: imageBase64,
    }

    items.unshift(newItem)

    return NextResponse.json(newItem)
  } catch (error) {
    console.error("Report item error:", error)
    return NextResponse.json({ error: "Failed to report item" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ items })
}
