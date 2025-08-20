import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { name, degree, skills, projects, achievements, jobDescription } = await request.json()

    if (!name || !degree || !skills || !projects || !jobDescription) {
      return NextResponse.json({ 
        error: "Name, degree, skills, projects, and job description are required" 
      }, { status: 400 })
    }

    // Use Groq for cover letter generation
    const { text: coverLetterResult } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Write a professional 200-word cover letter tailored to the following job description.
      
      Use the candidate details provided. Highlight relevant skills, projects, and enthusiasm.
      
      Candidate:
      Name: ${name}
      Degree: ${degree}
      Skills: ${skills}
      Projects: ${projects}
      Achievements/Experience: ${achievements || 'None specified'}
      
      Job Description: ${jobDescription}
      
      Requirements:
      - Keep it around 200 words
      - Use professional, enthusiastic tone
      - Highlight relevant skills and projects
      - Show genuine interest in the role
      - Include specific examples from projects
      - End with a strong call to action
      - Make it personalized and memorable
      
      Format the response as a professional cover letter that someone would actually submit.
      Do not include any formatting or markdown - just the plain text cover letter.`,
      temperature: 0.7,
    })

    return NextResponse.json({ 
      coverLetter: coverLetterResult,
      success: true 
    })
  } catch (error) {
    console.error("Cover letter generation error:", error)
    return NextResponse.json({ 
      error: "Failed to generate cover letter" 
    }, { status: 500 })
  }
}
