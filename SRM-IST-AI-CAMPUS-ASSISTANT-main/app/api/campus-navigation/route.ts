import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import campusData from "@/data/navigation/srm-campus-data.json"

// Navigation query processing and response generation
export async function POST(request: NextRequest) {
  try {
    const { query, startLocation = "Main Gate" } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const systemPrompt = `You are an AI navigation assistant for SRM Institute of Science and Technology, Delhi-NCR Campus in Ghaziabad. You have comprehensive knowledge of the campus layout and can provide detailed navigation instructions.

COMPREHENSIVE SRM CAMPUS NAVIGATION DATABASE:

${JSON.stringify(campusData, null, 2)}

NAVIGATION INSTRUCTIONS:
1. Always start from the user's current location or Main Gate if not specified
2. Provide step-by-step navigation with clear directions
3. Include landmarks and reference points
4. Mention approximate distances and walking times
5. Include floor numbers for multi-story buildings
6. Provide brief descriptions of destinations
7. Include alternative routes if available
8. Mention accessibility features (elevators, ramps)
9. Include operating hours if relevant
10. Provide contact information when appropriate

QUERY PROCESSING:
- Identify the destination from the user's query
- Match it with the campus database
- Generate a logical route from start to destination
- Include relevant landmarks and facilities along the way
- Provide context about the destination

User Query: "${query}"
Starting Location: "${startLocation}"

Generate a comprehensive navigation response that includes:
1. Clear step-by-step directions
2. Approximate walking time and distance
3. Landmarks and reference points
4. Brief description of the destination
5. Any relevant facilities or services at the destination
6. Alternative routes if applicable

Format the response as natural, conversational directions that someone would actually follow while walking on campus.`

    const { text: navigationResponse } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: systemPrompt,
      temperature: 0.7,
    })

    // Extract key information for structured response
    const { text: structuredInfo } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Based on the navigation response below, extract key information in JSON format:

Navigation Response: "${navigationResponse}"

Extract and return a JSON object with:
{
  "destination": "exact destination name",
  "estimatedTime": "estimated walking time in minutes",
  "estimatedDistance": "estimated distance in meters",
  "routeType": "indoor/outdoor/both",
  "accessibility": "wheelchair accessible or not",
  "keyLandmarks": ["list of key landmarks on the route"],
  "facilities": ["list of facilities at destination"],
  "operatingHours": "operating hours if applicable",
  "contactInfo": "contact information if available"
}

Respond only with valid JSON:`,
      temperature: 0.3,
    })

    let structuredData
    try {
      structuredData = JSON.parse(structuredInfo)
    } catch (parseError) {
      structuredData = {
        destination: "Unknown",
        estimatedTime: "5-10 minutes",
        estimatedDistance: "100-200 meters",
        routeType: "both",
        accessibility: "accessible",
        keyLandmarks: [],
        facilities: [],
        operatingHours: "Not specified",
        contactInfo: "Contact campus help desk"
      }
    }

    return NextResponse.json({
      navigation: navigationResponse.trim(),
      structured: structuredData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Navigation query error:", error)
    return NextResponse.json(
      {
        navigation: "I'm sorry, I'm having trouble processing your navigation request right now. Please try again or contact the campus help desk.",
        structured: {
          destination: "Error",
          estimatedTime: "Unknown",
          estimatedDistance: "Unknown",
          routeType: "unknown",
          accessibility: "unknown",
          keyLandmarks: [],
          facilities: [],
          operatingHours: "Not specified",
          contactInfo: "Contact campus help desk"
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
