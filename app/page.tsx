"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Award, Map, Bot, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

// Typing Animation Component
function TypingTitle({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)

  const colors = [
    "text-blue-600",
    "text-purple-600", 
    "text-pink-600",
    "text-red-600",
    "text-orange-600",
    "text-yellow-600",
    "text-green-600",
    "text-indigo-600"
  ]

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
        setColorIndex(prev => (prev + 1) % colors.length)
      }, 150) // Typing speed

      return () => clearTimeout(timer)
    } else {
      // Reset animation after a pause when typing is complete
      const resetTimer = setTimeout(() => {
        setDisplayText("")
        setCurrentIndex(0)
        setColorIndex(0)
      }, 2000) // 2 second pause before restarting

      return () => clearTimeout(resetTimer)
    }
  }, [currentIndex, text, colors.length])

  return (
    <h2 className="text-4xl font-bold mb-4 min-h-[3rem]">
      {displayText.split('').map((char, index) => (
        <span
          key={index}
          className={`${colors[index % colors.length]} transition-colors duration-300`}
        >
          {char}
        </span>
      ))}
      <span className="animate-pulse text-blue-600">|</span>
    </h2>
  )
}

export default function HomePage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Voice Assistant",
      description: "Hands-free campus queries with voice recognition",
      href: "/voice-assistant",
      status: "Beta",
    },
    {
      icon: Bot,
      title: "Smart Campus Buddy",
      description: "Personalized AI companion with daily digests and study suggestions",
      href: "/campus-buddy",
      status: "New",
    },
    {
      icon: FileText,
      title: "AI Career Mentor",
      description: "Resume feedback, skill gap analysis, and placement insights",
      href: "/career-mentor",
      status: "New",
    },
    {
      icon: Search,
      title: "Lost & Found",
      description: "Visual search for lost items using AI image matching",
      href: "/lost-found",
      status: "Active",
    },
    {
      icon: Award,
      title: "NFT Rewards",
      description: "Blockchain badges for coding achievements and GitHub projects",
      href: "/rewards",
      status: "New",
    },
    {
      icon: Map,
      title: "3D Campus Map",
      description: "Interactive campus navigation with real building views",
      href: "/campus-map",
      status: "Beta",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SRM-Institute-of-Science-Technology-KqJTS1tGgQKeVPofdLFQpJmANO6Qk9.png"
                alt="SRM IST Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-blue-900 dark:text-white">SRM IST AI Assistant</h1>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Delhi-NCR Campus, Ghaziabad</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">Learn. Leap. Lead.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <TypingTitle text="Welcome to SRM IST AI Campus Assistant" />
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-4xl mx-auto">
            Experience the future of campus life at SRM Institute of Science and Technology, Delhi-NCR Campus. Our
            AI-powered platform provides voice assistance, visual search, blockchain rewards for coding achievements,
            and interactive campus navigation tailored for our vibrant academic community.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">
              🎓 15 Departments
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-sm">
              🚌 16 Bus Routes
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm">
              🏠 1800+ Hostel Capacity
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-sm">
              🤖 AI-Powered
            </Badge>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Dean:</strong> 1800-889-3496
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>General:</strong> +91-7455000291
                </p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Director:</strong> 011-41676464
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Website:</strong> srmup.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="relative group">
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-[length:400%_400%] opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                
                {/* Card Content */}
                <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 group-hover:from-purple-400 group-hover:to-pink-600 transition-all duration-500 animate-pulse">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg text-blue-900 dark:text-white group-hover:text-purple-600 transition-colors duration-500">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-500">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={feature.href}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500">
                        Explore Feature
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 SRM Institute of Science and Technology - Delhi-NCR Campus, Ghaziabad</p>
            <p className="mt-1">Powered by Next.js 14, Groq AI & Advanced Analytics</p>
            <div className="mt-3">
              <Link href="/about-creator" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                ABOUT CREATOR
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
