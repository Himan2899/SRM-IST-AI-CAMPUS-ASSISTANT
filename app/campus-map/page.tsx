"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Map, BuildingIcon, Globe, Maximize2, RefreshCw, Brain, Mic, MicOff, Volume2, VolumeX, Navigation, Clock, MapPin, Users, Wifi, Coffee, BookOpen, GraduationCap, Home, Bus, Utensils } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

interface NavigationMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  structured?: any
}

interface NavigationResponse {
  navigation: string
  structured: {
    destination: string
    estimatedTime: string
    estimatedDistance: string
    routeType: string
    accessibility: string
    keyLandmarks: string[]
    facilities: string[]
    operatingHours: string
    contactInfo: string
  }
  timestamp: string
}

interface SentimentSuggestion {
  id: string
  sentiment: string
  suggestion: string
  color: string
  icon: string
  category: "academic" | "wellness" | "social" | "support"
}

const campusImages = {
  "main-academic":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAMPUS1.jpg-ZRVFhRQj7nFBOPx8tCNNSjxkgielG8.jpeg",
  administrative:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAMPUS1.jpg-ZRVFhRQj7nFBOPx8tCNNSjxkgielG8.jpeg",
  library: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAMPUS3.jpg-bKslGlINn3gerrbU6M3eVz2VQFeLKU.jpeg",
  auditorium: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAMPUS2.jpg-9uMz2PjpoSEyVYfez375OnOnG8D4Qh.jpeg",
  hostel: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAMPUS4.jpg-Bp1P5DTZu5EVnkZIT0itlvDK2q0zBv.jpeg",
  default: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CAMPUS1.jpg-ZRVFhRQj7nFBOPx8tCNNSjxkgielG8.jpeg",
}

const srmBuildings = [
  {
    id: "main",
    name: "Main Academic Block",
    position: "center",
    color: "#1e40af",
    type: "academic",
    description: "Primary academic building with multiple departments",
    imageKey: "main-academic",
  },
  {
    id: "admin",
    name: "Administrative Block",
    position: "front",
    color: "#059669",
    type: "administrative",
    description: "Main administrative offices and reception",
    imageKey: "administrative",
  },
  {
    id: "cse",
    name: "Computer Science & Engineering",
    position: "left-wing",
    color: "#dc2626",
    type: "academic",
    description: "CSE Department with labs and classrooms",
    imageKey: "main-academic",
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    position: "right-wing",
    color: "#ea580c",
    type: "academic",
    description: "ECE Department with advanced labs",
    imageKey: "main-academic",
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    position: "north-block",
    color: "#7c3aed",
    type: "academic",
    description: "Mechanical Engineering workshops and labs",
    imageKey: "main-academic",
  },
  {
    id: "civil",
    name: "Civil Engineering",
    position: "south-block",
    color: "#0891b2",
    type: "academic",
    description: "Civil Engineering department",
    imageKey: "main-academic",
  },
  {
    id: "library",
    name: "Central Library",
    position: "library-block",
    color: "#be185d",
    type: "academic",
    description: "Multi-floor library with digital resources",
    imageKey: "library",
  },
  {
    id: "hostel-boys",
    name: "Boys Hostel Complex",
    position: "hostel-area",
    color: "#16a34a",
    type: "residential",
    description: "Residential facility for male students",
    imageKey: "hostel",
  },
  {
    id: "hostel-girls",
    name: "Girls Hostel Complex",
    position: "hostel-area-2",
    color: "#ca8a04",
    type: "residential",
    description: "Residential facility for female students",
    imageKey: "hostel",
  },
  {
    id: "cafeteria",
    name: "Food Court & Cafeteria",
    position: "central-area",
    color: "#9333ea",
    type: "recreational",
    description: "Main dining facility",
    imageKey: "main-academic",
  },
  {
    id: "sports",
    name: "Sports Complex",
    position: "sports-area",
    color: "#dc2626",
    type: "recreational",
    description: "Indoor and outdoor sports facilities",
    imageKey: "main-academic",
  },
  {
    id: "auditorium",
    name: "Main Auditorium",
    position: "auditorium-block",
    color: "#059669",
    type: "recreational",
    description: "Large capacity auditorium for events",
    imageKey: "auditorium",
  },
]

const quickDestinations = [
  { name: "Academic Block", icon: GraduationCap, description: "Main academic building with departments" },
  { name: "Central Library", icon: BookOpen, description: "Library with study areas and resources" },
  { name: "Cafeteria", icon: Utensils, description: "Food courts and dining facilities" },
  { name: "Hostel Blocks", icon: Home, description: "Student residential facilities" },
  { name: "Transport Office", icon: Bus, description: "Bus services and transport information" },
  { name: "Placement Cell", icon: Users, description: "Career counseling and placement services" },
  { name: "Medical Room", icon: BuildingIcon, description: "Campus medical facilities" },
  { name: "Sports Complex", icon: BuildingIcon, description: "Playground and sports facilities" },
]

export default function CampusMapPage() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<NavigationMessage[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<(typeof srmBuildings)[0] | null>(srmBuildings[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sentimentInput, setSentimentInput] = useState("")
  const [suggestions, setSuggestions] = useState<SentimentSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const transcriptRef = useRef<string>("")

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
            handleNavigationQuery(finalTranscript)
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
        text: "Hello! I'm your AI Campus Navigation Assistant for SRM IST Delhi-NCR Campus. I can help you find any location on campus. Try asking me questions like 'How do I get to the library?' or 'Where is the cafeteria?' or 'Navigate me to the hostel blocks'. You can also type your questions or use voice commands.",
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

  const handleNavigationQuery = async (query: string) => {
    if (!query.trim()) return

    // Add user message
    const userMessage: NavigationMessage = {
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
      const response = await fetch("/api/campus-navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, startLocation: "Main Gate" }),
      })

      if (!response.ok) throw new Error("Navigation query failed")

      const result: NavigationResponse = await response.json()

      // Add AI response
      const aiMessage: NavigationMessage = {
        id: (Date.now() + 1).toString(),
        text: result.navigation,
        isUser: false,
        timestamp: new Date(),
        structured: result.structured,
      }
      setMessages((prev) => [...prev, aiMessage])

      // Speak the response
      speakText(result.navigation)
    } catch (error) {
      console.error("Navigation query error:", error)
      const errorMessage: NavigationMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your navigation request right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
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

  const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = textInput.trim()
    if (!value) return
    handleNavigationQuery(value)
    setTextInput("")
  }

  const handleQuickDestination = (destination: string) => {
    handleNavigationQuery(`How do I get to ${destination}?`)
  }

  const handleBuildingClick = (building: (typeof srmBuildings)[0]) => {
    setSelectedBuilding(building)
  }



  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const analyzeSentiment = async () => {
    if (!sentimentInput.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/sentiment-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentiment: sentimentInput }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      setSuggestions(data.suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Sentiment analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getCurrentImage = () => {
    if (!selectedBuilding) return campusImages.default
    return campusImages[selectedBuilding.imageKey as keyof typeof campusImages] || campusImages.default
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
                  <Map className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">SRM IST AI Assistant</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Live 3D Campus Map & AI Navigation</p>
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
            <Globe className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">SRM IST NCR Campus - Live 3D View & AI Navigation</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time satellite and 3D view of SRM Institute of Science and Technology, Delhi-NCR Campus, Ghaziabad with AI-powered voice and text navigation assistance.
          </p>
          {!speechSupported && (
            <Badge variant="destructive" className="mt-2">
              Voice navigation not supported in this browser
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Campus View */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      SRM IST NCR Campus - Real View
                    </CardTitle>
                    <CardDescription>
                      {selectedBuilding
                        ? `${selectedBuilding.name} - SRM IST NCR Ghaziabad`
                        : "Select a building to view"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open("https://share.google/M79b8ymojyHT5xUt1", "_blank")}
                    >
                      <Maximize2 className="h-4 w-4 mr-1" />
                      Google Earth
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full rounded-lg overflow-hidden border bg-gray-100 relative">
                  <div className="w-full h-full relative">
                    <Image
                      src={getCurrentImage() || "/placeholder.svg"}
                      alt={selectedBuilding ? `${selectedBuilding.name} - SRM IST NCR Ghaziabad` : "SRM IST Campus"}
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />

                    {/* Building overlay info */}
                    {selectedBuilding && (
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-md">
                        <div className="text-sm">
                          <div className="font-bold text-blue-600 text-lg">{selectedBuilding.name}</div>
                          <div className="text-gray-600 mt-1">{selectedBuilding.description}</div>
                          <div className="text-xs text-gray-500 mt-2 capitalize">
                            {selectedBuilding.type} • SRM IST NCR Ghaziabad
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sentiment suggestions overlay */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-4 right-4 space-y-3 max-w-sm z-50">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={suggestion.id}
                            className={`${suggestion.color} backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-white/30 transform transition-all duration-500 animate-in slide-in-from-right-2 fade-in-0`}
                            style={{
                              animationDelay: `${index * 200}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="flex items-start gap-3 text-white">
                              <span className="text-3xl flex-shrink-0 drop-shadow-lg">{suggestion.icon}</span>
                              <div className="flex-1">
                                <div className="font-bold text-base capitalize mb-2 text-white drop-shadow-md">{suggestion.category} Support</div>
                                <div className="text-sm leading-relaxed text-white font-medium drop-shadow-sm">{suggestion.suggestion}</div>
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-white/40">
                              <div className="text-xs text-white font-semibold flex items-center gap-1">
                                <Brain className="h-3 w-3" />
                                AI-Powered Suggestion
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Building selection overlay */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <BuildingIcon className="h-4 w-4" />
                        SRM IST Campus Buildings
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-xs max-h-48 overflow-y-auto">
                        {srmBuildings.map((building) => (
                          <button
                            key={building.id}
                            onClick={() => handleBuildingClick(building)}
                            className={`p-2 rounded text-left hover:bg-blue-100 transition-colors border ${
                              selectedBuilding?.id === building.id ? "bg-blue-200 border-blue-400" : "border-gray-200"
                            }`}
                          >
                            <div className="font-medium">{building.name}</div>
                            <div className="text-gray-500 capitalize">{building.type}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-4 right-4 space-y-2 max-w-sm">
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className={`${suggestion.color} backdrop-blur-sm rounded-lg p-4 shadow-lg animate-pulse`}
                          >
                            <div className="flex items-center gap-2 text-white text-sm">
                              <span className="text-lg">{suggestion.icon}</span>
                              <div>
                                <div className="font-medium capitalize">{suggestion.category} Support</div>
                                <div className="text-xs opacity-90">{suggestion.suggestion}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <BuildingIcon className="h-4 w-4" />
                      SRM IST Campus Buildings
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-xs max-h-48 overflow-y-auto">
                      {srmBuildings.map((building) => (
                        <button
                          key={building.id}
                          onClick={() => handleBuildingClick(building)}
                          className={`p-2 rounded text-left hover:bg-blue-100 transition-colors border ${
                            selectedBuilding?.id === building.id ? "bg-blue-200 border-blue-400" : "border-gray-200"
                          }`}
                        >
                          <div className="font-medium">{building.name}</div>
                          <div className="text-gray-500 capitalize">{building.type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <p className="flex items-center gap-1">
                      📸 <span>Real campus photography</span>
                    </p>
                    <p className="flex items-center gap-1">
                      🏢 <span>Authentic building views</span>
                    </p>
                    <p className="flex items-center gap-1">
                      📍 <span>SRM IST NCR Ghaziabad</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Campus View</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Navigation Chat Interface */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  AI Navigation Assistant
                  {messages.length > 1 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {messages.length - 1} routes
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isListening && "Listening... Speak now"}
                  {isProcessing && "Processing your navigation request..."}
                  {!isListening && !isProcessing && "Ask me how to get anywhere on campus"}
                  {messages.length > 3 && " • Scroll to see more routes"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4 h-[350px]" type="always">
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
                            {message.structured && (
                              <Badge variant="outline" className="text-xs">
                                Navigation
                              </Badge>
                            )}
                          </div>
                          {message.structured && !message.isUser && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <strong>Destination:</strong> {message.structured.destination}
                                </div>
                                <div>
                                  <strong>Time:</strong> {message.structured.estimatedTime}
                                </div>
                                <div>
                                  <strong>Distance:</strong> {message.structured.estimatedDistance}
                                </div>
                                <div>
                                  <strong>Type:</strong> {message.structured.routeType}
                                </div>
                                {message.structured.facilities.length > 0 && (
                                  <div className="col-span-2">
                                    <strong>Facilities:</strong> {message.structured.facilities.join(", ")}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {currentTranscript && (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-2 border-dashed border-blue-300">
                          <p className="text-sm">{currentTranscript}</p>
                          <span className="text-xs opacity-70">Listening...</span>
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
                    placeholder="Type your navigation question..."
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

            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Campus Location</h4>
                    <p className="text-gray-600">Delhi-NCR Campus, Ghaziabad, UP</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Coordinates</h4>
                    <p className="text-gray-600">28.7547°N, 77.5104°E</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Campus Area</h4>
                    <p className="text-gray-600">25+ Acres</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Established</h4>
                    <p className="text-gray-600">1997 (25+ Years)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Quick Actions, Building Info & AI Sentiment */}
          <div className="space-y-6">
            {/* Quick Destinations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Destinations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickDestinations.map((destination, index) => {
                  const Icon = destination.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs bg-transparent"
                      onClick={() => handleQuickDestination(destination.name)}
                      disabled={isProcessing}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">{destination.name}</div>
                        <div className="text-xs text-gray-500">{destination.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Selected Building Info */}
            {selectedBuilding && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BuildingIcon className="h-5 w-5" />
                    Building Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBuilding.name}</h3>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {selectedBuilding.type}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Building ID:</strong> {selectedBuilding.id.toUpperCase()}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedBuilding.type}
                    </p>
                    <p>
                      <strong>Description:</strong> {selectedBuilding.description}
                    </p>
                    <p>
                      <strong>Status:</strong> <span className="text-green-600">Operational</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Sentiment Suggestions */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Brain className="h-5 w-5" />
                  AI Sentiment Support
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  Share your feelings and get personalized AI suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="sentiment" className="text-blue-700 dark:text-blue-300 font-medium">
                    How are you feeling today? 💭
                  </Label>
                  <Textarea
                    id="sentiment"
                    placeholder="Share your thoughts, feelings, or concerns about campus life... I'm here to help! 🌟"
                    value={sentimentInput}
                    onChange={(e) => setSentimentInput(e.target.value)}
                    className="min-h-[100px] border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <Button
                    onClick={analyzeSentiment}
                    disabled={!sentimentInput.trim() || isAnalyzing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing your feelings...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Get AI Suggestions
                      </div>
                    )}
                  </Button>
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-blue-200">
                    <h4 className="font-bold text-base text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      ✨ Personalized AI Suggestions
                    </h4>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        className={`${suggestion.color} rounded-xl p-4 shadow-xl border-2 border-white/30 transform transition-all duration-300 hover:scale-105`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <div className="flex items-start gap-3 text-white">
                          <span className="text-3xl flex-shrink-0 drop-shadow-lg">{suggestion.icon}</span>
                          <div className="flex-1">
                            <div className="font-bold text-base capitalize mb-2 text-white drop-shadow-md">{suggestion.category} Support</div>
                            <div className="text-sm leading-relaxed text-white font-medium drop-shadow-sm">{suggestion.suggestion}</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/40">
                          <div className="text-xs text-white font-semibold flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            AI-Powered Suggestion
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Queries Asked</span>
                  <span className="font-semibold">{messages.filter((m) => m.isUser).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Routes Generated</span>
                  <span className="font-semibold">{messages.filter((m) => !m.isUser && m.structured).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Voice Support</span>
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
