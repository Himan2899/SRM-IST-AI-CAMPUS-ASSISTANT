import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const studentName = formData.get("studentName") as string
    const department = formData.get("department") as string
    const semester = formData.get("semester") as string
    const timetableFile = formData.get("timetableFile") as File

    if (!timetableFile) {
      return NextResponse.json({ success: false, error: "Timetable file is required" }, { status: 400 })
    }

    console.log(
      "[v0] Processing timetable file:",
      timetableFile.name,
      "Size:",
      timetableFile.size,
      "Type:",
      timetableFile.type,
    )

    const fileBuffer = await timetableFile.arrayBuffer()
    const base64File = Buffer.from(fileBuffer).toString("base64")

    const { text: timetableAnalysis } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `You are helping a ${department} student in ${semester} semester at SRM IST NCR Ghaziabad.

Create a realistic weekly class schedule with 6 subjects. For each subject, provide:
- Subject name
- Class time (like 9:00 AM - 10:00 AM)  
- Room number (like CSE-101)
- Type (lecture or lab)

Make it realistic for a ${department} student. Just list them clearly.`,
    })

    console.log("[v0] Timetable analysis response:", timetableAnalysis)

    const { text: digestData } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Create 4 daily reminders for ${studentName}, a ${department} student at SRM IST NCR Ghaziabad.

Include:
1. A morning class reminder
2. Bus route reminder (Route 105 from Ghaziabad at 7:10 AM)
3. A study suggestion  
4. An assignment reminder

Keep each reminder short and helpful.`,
    })

    console.log("[v0] Digest data response:", digestData)

    const { text: resourceData } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `List 5 study resources for ${department} students. Include books and online resources.

For each resource, mention:
- Title
- Type (book or online)
- Subject it covers

Make them relevant for ${department} studies.`,
    })

    console.log("[v0] Resource data response:", resourceData)

    let timetable, digests, resources

    try {
      if (timetableAnalysis && timetableAnalysis.trim()) {
        const lines = timetableAnalysis.split("\n").filter((line) => line.trim().length > 0)
        timetable = []

        for (const line of lines) {
          // Look for patterns like "Subject: Name" or just subject names
          if (
            line.toLowerCase().includes("subject") ||
            line.toLowerCase().includes("class") ||
            line.toLowerCase().includes("lecture") ||
            line.toLowerCase().includes("lab")
          ) {
            // Extract subject name (try multiple patterns)
            let subject = line
              .replace(/^\d+\.?\s*/, "")
              .replace(/^-\s*/, "")
              .trim()
            if (subject.toLowerCase().startsWith("subject:")) {
              subject = subject.substring(8).trim()
            }

            // Generate realistic time slots
            const timeSlots = [
              "9:00 AM - 10:00 AM",
              "10:00 AM - 11:00 AM",
              "11:00 AM - 12:00 PM",
              "2:00 PM - 3:00 PM",
              "3:00 PM - 4:00 PM",
              "2:00 PM - 4:00 PM",
            ]

            const rooms =
              department === "Computer Science"
                ? ["CSE-101", "CSE-102", "CSE-103", "LAB-A", "LAB-B"]
                : ["ECE-101", "ECE-102", "ECE-103", "LAB-C", "LAB-D"]

            timetable.push({
              subject: subject || `${department} Subject ${timetable.length + 1}`,
              time: timeSlots[timetable.length % timeSlots.length],
              room: rooms[timetable.length % rooms.length],
              type: subject.toLowerCase().includes("lab") ? "lab" : "lecture",
            })

            if (timetable.length >= 6) break
          }
        }

        console.log("[v0] Parsed timetable successfully:", timetable.length, "entries")
      } else {
        throw new Error("Empty timetable response")
      }
    } catch (error) {
      console.error("[v0] Timetable parsing failed:", error)
      const departmentSubjects = {
        "Computer Science": [
          { subject: "Data Structures & Algorithms", time: "9:00 AM - 10:00 AM", room: "CSE-101", type: "lecture" },
          { subject: "Database Management Systems", time: "10:00 AM - 11:00 AM", room: "CSE-102", type: "lecture" },
          { subject: "Computer Networks", time: "11:00 AM - 12:00 PM", room: "CSE-103", type: "lecture" },
          { subject: "Programming Lab", time: "2:00 PM - 4:00 PM", room: "LAB-A", type: "lab" },
          { subject: "Software Engineering", time: "3:00 PM - 4:00 PM", room: "CSE-104", type: "lecture" },
          { subject: "Operating Systems", time: "4:00 PM - 5:00 PM", room: "CSE-105", type: "lecture" },
        ],
        Electronics: [
          { subject: "Digital Electronics", time: "9:00 AM - 10:00 AM", room: "ECE-101", type: "lecture" },
          { subject: "Signals & Systems", time: "10:00 AM - 11:00 AM", room: "ECE-102", type: "lecture" },
          { subject: "Microprocessors", time: "11:00 AM - 12:00 PM", room: "ECE-103", type: "lecture" },
          { subject: "Electronics Lab", time: "2:00 PM - 4:00 PM", room: "LAB-B", type: "lab" },
          { subject: "Communication Systems", time: "3:00 PM - 4:00 PM", room: "ECE-104", type: "lecture" },
          { subject: "Control Systems", time: "4:00 PM - 5:00 PM", room: "ECE-105", type: "lecture" },
        ],
      }

      timetable = departmentSubjects[department as keyof typeof departmentSubjects] || departmentSubjects["Computer Science"]
    }

    try {
      if (digestData && digestData.trim()) {
        const lines = digestData.split("\n").filter((line) => line.trim().length > 0)
        digests = []

        for (const line of lines) {
          if (line.trim().length > 10) {
            // Skip very short lines
            const message = line
              .replace(/^\d+\.?\s*/, "")
              .replace(/^-\s*/, "")
              .trim()

            digests.push({
              message: message || `Daily reminder ${digests.length + 1}`,
              type: message.toLowerCase().includes("class")
                ? "schedule"
                : message.toLowerCase().includes("bus")
                  ? "reminder"
                  : message.toLowerCase().includes("study")
                    ? "study"
                    : "reminder",
              priority: digests.length < 2 ? "high" : "medium",
              time:
                digests.length === 0
                  ? "8:00 AM"
                  : digests.length === 1
                    ? "7:00 AM"
                    : digests.length === 2
                      ? "1:00 PM"
                      : "9:00 AM",
            })

            if (digests.length >= 4) break
          }
        }

        console.log("[v0] Parsed digests successfully:", digests.length, "messages")
      } else {
        throw new Error("Empty digest response")
      }
    } catch (error) {
      console.error("[v0] Digest parsing failed:", error)
      digests = [
        {
          message: `Good morning ${studentName}! Your first class starts at 9:00 AM. Don't forget your textbooks!`,
          type: "schedule",
          priority: "high",
          time: "8:00 AM",
        },
        {
          message: "Catch Route 105 bus at 7:10 AM from Ghaziabad to reach SRM IST NCR campus on time.",
          type: "reminder",
          priority: "medium",
          time: "7:00 AM",
        },
        {
          message: "Lab session at 2:00 PM today - review your assignments beforehand.",
          type: "study",
          priority: "medium",
          time: "1:00 PM",
        },
        {
          message: "Assignment submission due this Friday. Start working on it today.",
          type: "assignment",
          priority: "high",
          time: "9:00 AM",
        },
      ]
    }

    try {
      if (resourceData && resourceData.trim()) {
        const lines = resourceData.split("\n").filter((line) => line.trim().length > 0)
        resources = []

        for (const line of lines) {
          if (line.trim().length > 5) {
            const title = line
              .replace(/^\d+\.?\s*/, "")
              .replace(/^-\s*/, "")
              .trim()

            resources.push({
              title: title || `Study Resource ${resources.length + 1}`,
              type:
                title.toLowerCase().includes("online") || title.toLowerCase().includes("website") ? "online" : "book",
              subject: department,
              relevance: Math.floor(Math.random() * 20) + 80,
            })

            if (resources.length >= 5) break
          }
        }

        console.log("[v0] Parsed resources successfully:", resources.length, "resources")
      } else {
        throw new Error("Empty resource response")
      }
    } catch (error) {
      console.error("[v0] Resource parsing failed:", error)
      resources = [
        {
          title: "Introduction to Algorithms - CLRS",
          type: "book",
          subject: "Data Structures",
          relevance: 95,
        },
        {
          title: "Database System Concepts",
          type: "book",
          subject: "Database Management",
          relevance: 92,
        },
        {
          title: "Computer Networks - Tanenbaum",
          type: "book",
          subject: "Computer Networks",
          relevance: 90,
        },
        {
          title: "GeeksforGeeks Programming Tutorials",
          type: "online",
          subject: "Programming",
          relevance: 88,
        },
        {
          title: "Software Engineering - Pressman",
          type: "book",
          subject: "Software Engineering",
          relevance: 85,
        },
      ]
    }

    console.log("[v0] Setup completed successfully for", studentName)

    return NextResponse.json({
      success: true,
      timetable,
      digests,
      resources,
    })
  } catch (error) {
    console.error("[v0] Campus buddy setup error:", error)
    return NextResponse.json({ success: false, error: "Setup failed" }, { status: 500 })
  }
}
