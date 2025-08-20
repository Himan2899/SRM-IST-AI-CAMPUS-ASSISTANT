import { type NextRequest, NextResponse } from "next/server"

// Dynamic import for pdf-parse to handle module compatibility
let pdfParse: any = null
try {
  pdfParse = require("pdf-parse")
} catch (error) {
  console.log("pdf-parse not available for test")
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "PDF parsing system is ready",
    pdfParseAvailable: !!pdfParse,
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const testFile = formData.get("file") as File

    if (!testFile) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    console.log(`Testing PDF parsing with file: ${testFile.name}, size: ${testFile.size} bytes`)

    const arrayBuffer = await testFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    let extractedText = ""
    let method = "none"
    
    // Test pdf-parse
    if (pdfParse) {
      try {
        const data = await pdfParse(buffer)
        if (data.text && data.text.trim().length > 0) {
          extractedText = data.text.trim()
          method = "pdf-parse"
        }
      } catch (error) {
        console.log("pdf-parse test failed:", (error as Error).message)
      }
    }
    
    // Test fallback method
    if (!extractedText) {
      const text = buffer.toString('utf8')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        .replace(/[^\x20-\x7E\n\r\t]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      if (text.length > 0) {
        extractedText = text
        method = "fallback"
      }
    }

    return NextResponse.json({
      success: true,
      fileName: testFile.name,
      fileSize: testFile.size,
      extractedTextLength: extractedText.length,
      extractionMethod: method,
      sampleText: extractedText.substring(0, 200) + "...",
      pdfParseAvailable: !!pdfParse
    })
  } catch (error) {
    console.error("Test failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Test failed: " + (error as Error).message 
    }, { status: 500 })
  }
}
