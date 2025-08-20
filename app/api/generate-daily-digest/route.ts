import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { studentName, department, semester, timetable } = await request.json()
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const { text: digestData } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Generate fresh daily digest messages for ${studentName}, a ${semester} ${department} student at SRM IST NCR Ghaziabad. 
      
Current time: ${currentTime}, Date: ${currentDate}

Student's actual timetable: ${JSON.stringify(timetable)}

Based on their REAL timetable, include:
- Specific class reminders with exact times and room numbers from their schedule
- SRM bus route timings (Route 105 from Ghaziabad at 7:10 AM, Route 112 from Meerut at 7:40 AM, etc.)
- Study suggestions based on TODAY's actual subjects from their timetable
- Preparation reminders for upcoming classes (what to bring, lab manuals, etc.)
- Time management tips based on their class gaps

Only mention classes and subjects that are actually in their uploaded timetable. Be specific and accurate.

Format as JSON array with fields: message, type (schedule/reminder/suggestion), priority (high/medium/low), time. Generate 5-6 relevant messages.`,
    })

    let digests
    try {
      digests = JSON.parse(digestData.replace(/```json|```/g, "").trim())
    } catch {
      digests = [
        {
          message: `${studentName}, please upload your timetable to get personalized schedule reminders.`,
          type: "reminder",
          priority: "high",
          time: currentTime,
        },
        {
          message: "Route 105 bus from Ghaziabad departs at 7:10 AM. Plan your commute accordingly.",
          type: "reminder",
          priority: "medium",
          time: currentTime,
        },
        {
          message: "Check your uploaded timetable for today's classes and prepare accordingly.",
          type: "suggestion",
          priority: "medium",
          time: currentTime,
        },
        {
          message: "SRM IST library resources are available online. Access them through the student portal.",
          type: "suggestion",
          priority: "low",
          time: currentTime,
        },
        {
          message: "Stay hydrated and take regular breaks between your classes!",
          type: "suggestion",
          priority: "low",
          time: currentTime,
        },
      ]
    }

    return NextResponse.json({
      success: true,
      digests,
    })
  } catch (error) {
    console.error("Daily digest generation error:", error)
    return NextResponse.json({ success: false, error: "Digest generation failed" }, { status: 500 })
  }
}
