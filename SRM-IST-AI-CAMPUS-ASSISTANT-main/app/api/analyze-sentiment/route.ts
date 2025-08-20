import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const { text: analysisResult } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Analyze the following text for sentiment and crisis risk indicators. Respond with a JSON object containing:
      - sentiment: "positive", "negative", or "neutral"
      - confidence: number between 0 and 1
      - riskLevel: "low", "medium", or "high" (based on crisis indicators like depression, anxiety, self-harm, suicidal ideation)
      - keywords: array of concerning words/phrases found
      - explanation: brief explanation of the analysis

      Text to analyze: "${text}"

      Respond only with valid JSON:`,
      temperature: 0.1,
    })

    // Parse the AI response
    let analysis
    try {
      analysis = JSON.parse(analysisResult)
    } catch (parseError) {
      // Fallback analysis if JSON parsing fails
      analysis = {
        sentiment:
          text.toLowerCase().includes("sad") || text.toLowerCase().includes("depressed") ? "negative" : "neutral",
        confidence: 0.7,
        riskLevel: "medium",
        keywords: [],
        explanation: "Basic keyword-based analysis (AI parsing failed)",
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
