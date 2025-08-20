import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { name, degree, skills, projects, achievements } = await request.json()

    if (!name || !degree || !skills || !projects) {
      return NextResponse.json({ 
        error: "Name, degree, skills, and projects are required" 
      }, { status: 400 })
    }

    // Use Groq for elevator pitch generation
    const { text: pitchResult } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Generate a 30-60 second professional elevator pitch for an interview.
      
      Use confident tone, highlight technical skills, academic background, and notable projects.
      
      Input:
      Name: ${name}
      Degree: ${degree}
      Skills: ${skills}
      Projects: ${projects}
      Achievements: ${achievements || 'None specified'}
      
      Requirements:
      - Keep it between 30-60 seconds when spoken
      - Use confident, professional tone
      - Highlight technical skills and academic background
      - Mention specific projects with brief impact
      - Include achievements if provided
      - Make it engaging and memorable
      - End with a clear value proposition
      
      Format the response as a natural, conversational pitch that someone would actually say in an interview.
      Do not include any formatting or markdown - just the plain text pitch.`,
      temperature: 0.7,
    })

    return NextResponse.json({ 
      pitch: pitchResult,
      success: true 
    })
  } catch (error) {
    console.error("Elevator pitch generation error:", error)
    return NextResponse.json({ 
      error: "Failed to generate elevator pitch" 
    }, { status: 500 })
  }
}
