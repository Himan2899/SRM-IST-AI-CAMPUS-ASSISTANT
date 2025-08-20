"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Mic, MicOff, Volume2, VolumeX, Brain } from "lucide-react"
import Link from "next/link"

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onend: () => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface VoiceMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  confidence?: number
}

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const transcriptRef = useRef<string>("")
  const [textInput, setTextInput] = useState("")

  useEffect(() => {
    // Check for speech recognition support
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const speechSynthesis = window.speechSynthesis

      if (SpeechRecognition && speechSynthesis) {
        setSpeechSupported(true)
        synthRef.current = speechSynthesis

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event) => {
          let transcript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          transcriptRef.current = transcript
          setCurrentTranscript(transcript)
        }

        recognition.onend = () => {
          setIsListening(false)
          const finalTranscript = transcriptRef.current.trim()
          if (finalTranscript) {
            handleVoiceQuery(finalTranscript)
          }
          transcriptRef.current = ""
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }

    // Add welcome message
    setMessages([
      {
        id: "welcome",
        text: "Hello! I'm your AI Campus Assistant for SRM IST Delhi-NCR Campus. I have comprehensive knowledge about admissions, academic programs, fees, hostels, placements, transport, facilities, and much more. You can ask me anything about the campus - from admission requirements to hostel amenities, placement statistics to scholarship opportunities. Try asking about specific topics like 'What are the admission requirements?' or 'How much are the hostel fees?'",
        isUser: false,
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setCurrentTranscript("")
      transcriptRef.current = ""
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleVoiceQuery = async (query: string) => {
    if (!query.trim()) return

    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: query,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setCurrentTranscript("")
    transcriptRef.current = ""
    setIsProcessing(true)

    try {
      const response = await fetch("/api/voice-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) throw new Error("Query failed")

      const result = await response.json()

      // Add AI response
      const aiMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        isUser: false,
        timestamp: new Date(),
        confidence: result.confidence,
      }
      setMessages((prev) => [...prev, aiMessage])

      // Speak the response
      speakText(result.response)
    } catch (error) {
      console.error("Voice query error:", error)
      const errorMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your request right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = textInput.trim()
    if (!value) return
    handleVoiceQuery(value)
    setTextInput("")
  }

  const speakText = (text: string) => {
    if (synthRef.current && speechSupported) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">CampusAI</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Voice Assistant</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Voice Assistant</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ask questions about SRM IST Delhi-NCR Campus using your voice. I can help with admissions, fees, hostels, placements, transport, facilities, academic programs, scholarships, and much more!
          </p>
          {!speechSupported && (
            <Badge variant="destructive" className="mt-2">
              Speech recognition not supported in this browser
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversation
                  {messages.length > 1 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {messages.length - 1} messages
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isListening && "Listening... Speak now"}
                  {isProcessing && "Processing your request..."}
                  {!isListening && !isProcessing && "Click the microphone to start talking"}
                  {messages.length > 3 && " • Scroll to see more messages"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4 h-[400px]" type="always">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            message.isUser
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                            {message.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {(message.confidence * 100).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentTranscript && (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-2 border-dashed border-blue-300">
                          <p className="text-sm">{currentTranscript}</p>
                          <span className="text-xs opacity-70">Speaking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Text input for typed queries */}
                <form onSubmit={handleTextSubmit} className="mt-3 flex items-center gap-2">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your question..."
                    disabled={isProcessing}
                  />
                  <Button type="submit" disabled={isProcessing || !textInput.trim()}>
                    Send
                  </Button>
                </form>

                {/* Voice Controls */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t">
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!speechSupported || isProcessing}
                    size="lg"
                    className={`rounded-full w-16 h-16 ${
                      isListening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  <Button
                    onClick={isSpeaking ? stopSpeaking : () => {}}
                    disabled={!speechSupported || !isSpeaking}
                    variant="outline"
                    size="lg"
                    className="rounded-full w-16 h-16"
                  >
                    {isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "What are the admission requirements?",
                  "How much are the hostel fees?",
                  "What companies recruit from SRM?",
                  "Where is the library located?",
                  "How do I apply for scholarships?",
                  "What are the transport facilities?",
                  "What clubs are available?",
                  "How do I contact the dean?",
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs bg-transparent"
                    onClick={() => handleVoiceQuery(question)}
                    disabled={isProcessing}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Voice Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions Asked</span>
                  <span className="font-semibold">{messages.filter((m) => m.isUser).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Responses Given</span>
                  <span className="font-semibold">{messages.filter((m) => !m.isUser).length - 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Speech Support</span>
                  <Badge variant={speechSupported ? "default" : "destructive"} className="text-xs">
                    {speechSupported ? "Active" : "Unavailable"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
