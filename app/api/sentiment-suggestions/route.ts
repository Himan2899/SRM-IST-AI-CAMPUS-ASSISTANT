import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { sentiment } = await request.json()

    if (!sentiment) {
      return NextResponse.json({ error: "Sentiment is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `You are an AI counselor for SRM IST NCR Ghaziabad students. Analyze this student sentiment and provide 3 helpful, supportive suggestions with appropriate categories.

Student sentiment: "${sentiment}"

Respond with exactly 3 suggestions in this JSON format (NO EMOJIS, only valid JSON characters):
{
  "suggestions": [
    {
      "id": "1",
      "sentiment": "detected_emotion",
      "suggestion": "specific helpful advice",
      "color": "bg-gradient-to-r from-red-600 to-red-700 shadow-lg",
      "icon": "🎓",
      "category": "academic"
    },
    {
      "id": "2", 
      "sentiment": "detected_emotion",
      "suggestion": "specific helpful advice",
      "color": "bg-gradient-to-r from-green-600 to-green-700 shadow-lg",
      "icon": "🧘",
      "category": "wellness"
    },
    {
      "id": "3",
      "sentiment": "detected_emotion", 
      "suggestion": "specific helpful advice",
      "color": "bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg",
      "icon": "💝",
      "category": "support"
    }
  ]
}

IMPORTANT: 
- Use ONLY valid JSON characters (no special symbols or emojis in the actual response)
- Make suggestions specific to SRM IST campus life, studies, social connections, or mental wellness
- Use encouraging, supportive language
- Ensure the response is valid JSON that can be parsed`,
    })

    // Clean the response text to remove any potential invalid characters
    const cleanedText = text.trim().replace(/[^\x20-\x7E]/g, '')
    
    let suggestions
    try {
      suggestions = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      console.error("Raw response:", text)
      console.error("Cleaned response:", cleanedText)
      
      // Fallback response if JSON parsing fails
      suggestions = {
        suggestions: [
          {
            id: "1",
            sentiment: "general",
            suggestion: "Consider reaching out to the Student Counselling Cell for personalized support",
            color: "bg-gradient-to-r from-red-600 to-red-700 shadow-lg",
            icon: "💝",
            category: "support"
          },
          {
            id: "2",
            sentiment: "general", 
            suggestion: "Connect with your faculty mentor or department HOD for academic guidance",
            color: "bg-gradient-to-r from-green-600 to-green-700 shadow-lg",
            icon: "🎓",
            category: "academic"
          },
          {
            id: "3",
            sentiment: "general",
            suggestion: "Join campus clubs and societies to build social connections and reduce stress",
            color: "bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg", 
            icon: "🧘",
            category: "wellness"
          }
        ]
      }
    }

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
