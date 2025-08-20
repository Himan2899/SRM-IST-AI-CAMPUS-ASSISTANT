"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, Calendar, BookOpen, Clock, MapPin, AlertCircle, Lightbulb, ExternalLink } from "lucide-react"

interface TimetableEntry {
  subject: string
  time: string
  room: string
  type: "lecture" | "lab" | "tutorial"
  day: string
}

interface StudyResource {
  title: string
  type: "book" | "video" | "article"
  subject: string
  relevance: number
}

interface SmartDigest {
  message: string
  type: "schedule" | "reminder" | "suggestion"
  priority: "high" | "medium" | "low"
  time: string
}

export default function CampusBuddyPage() {
  const [studentName, setStudentName] = useState("")
  const [department, setDepartment] = useState("")
  const [semester, setSemester] = useState("")
  const [timetable] = useState<TimetableEntry[]>([
    { subject: "Data Structures and Algorithms", time: "9:20 - 10:10", room: "LH-403", type: "lecture", day: "Monday" },
    {
      subject: "Data Structures and Algorithms Lab",
      time: "10:10 - 11:00",
      room: "LH-403",
      type: "lab",
      day: "Monday",
    },
    {
      subject: "Transforms and Boundary Value Problems",
      time: "11:10 - 12:00",
      room: "LH-403",
      type: "lecture",
      day: "Monday",
    },
    {
      subject: "Design Thinking and Methodology",
      time: "12:00 - 12:50",
      room: "LH-403",
      type: "lecture",
      day: "Monday",
    },
    { subject: "Design Thinking and Methodology", time: "1:30 - 2:20", room: "LH-403", type: "lecture", day: "Monday" },
    { subject: "Operating Systems", time: "9:20 - 10:10", room: "LH-403", type: "lecture", day: "Tuesday" },
    {
      subject: "Data Structures and Algorithms Lab",
      time: "10:10 - 11:00",
      room: "LH-403",
      type: "lab",
      day: "Tuesday",
    },
    {
      subject: "Transforms and Boundary Value Problems",
      time: "11:10 - 12:00",
      room: "LH-403",
      type: "lecture",
      day: "Tuesday",
    },
    { subject: "Professional Ethics", time: "12:00 - 12:50", room: "LH-403", type: "lecture", day: "Tuesday" },
    {
      subject: "Design Thinking and Methodology",
      time: "1:30 - 2:20",
      room: "LH-403",
      type: "lecture",
      day: "Tuesday",
    },
    { subject: "Data Structures Lab C-6/C-7", time: "2:20 - 3:10", room: "C-6/C-7", type: "lab", day: "Tuesday" },
    {
      subject: "Design Thinking and Methodology",
      time: "9:20 - 10:10",
      room: "LH-403",
      type: "lecture",
      day: "Wednesday",
    },
    {
      subject: "Data Structures and Algorithms Lab",
      time: "10:10 - 11:00",
      room: "LH-403",
      type: "lab",
      day: "Wednesday",
    },
    {
      subject: "Data Structures and Algorithms",
      time: "11:10 - 12:00",
      room: "LH-403",
      type: "lecture",
      day: "Wednesday",
    },
    { subject: "Operating Systems", time: "12:00 - 12:50", room: "LH-403", type: "lecture", day: "Wednesday" },
    {
      subject: "Transforms and Boundary Value Problems",
      time: "1:30 - 2:20",
      room: "LH-403",
      type: "lecture",
      day: "Wednesday",
    },
    { subject: "Operating Systems Lab C-1", time: "2:20 - 3:10", room: "C-1", type: "lab", day: "Wednesday" },
    { subject: "Operating Systems", time: "9:20 - 10:10", room: "LH-403", type: "lecture", day: "Thursday" },
    {
      subject: "Data Structures and Algorithms Lab",
      time: "10:10 - 11:00",
      room: "LH-403",
      type: "lab",
      day: "Thursday",
    },
    {
      subject: "Data Structures and Algorithms",
      time: "11:10 - 12:00",
      room: "LH-403",
      type: "lecture",
      day: "Thursday",
    },
    { subject: "Professional Ethics", time: "12:00 - 12:50", room: "LH-403", type: "lecture", day: "Thursday" },
    {
      subject: "Transforms and Boundary Value Problems",
      time: "1:30 - 2:20",
      room: "LH-403",
      type: "lecture",
      day: "Thursday",
    },
    { subject: "Data Structures Lab C-7/C-8", time: "2:20 - 3:10", room: "C-7/C-8", type: "lab", day: "Thursday" },
    { subject: "Operating Systems", time: "9:20 - 10:10", room: "LH-403", type: "lecture", day: "Friday" },
    {
      subject: "Data Structures and Algorithms Lab",
      time: "10:10 - 11:00",
      room: "LH-403",
      type: "lab",
      day: "Friday",
    },
    {
      subject: "Data Structures and Algorithms",
      time: "11:10 - 12:00",
      room: "LH-403",
      type: "lecture",
      day: "Friday",
    },
    {
      subject: "Data Structures and Algorithms",
      time: "12:00 - 12:50",
      room: "LH-403",
      type: "lecture",
      day: "Friday",
    },
    {
      subject: "Foundation to Programming Skills",
      time: "1:30 - 2:20",
      room: "LH-403",
      type: "lecture",
      day: "Friday",
    },
    { subject: "MMI/Library", time: "2:20 - 3:10", room: "Library", type: "tutorial", day: "Friday" },
  ])
  const [smartDigests, setSmartDigests] = useState<SmartDigest[]>([])
  const [studyResources] = useState<StudyResource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSetup, setIsSetup] = useState(false)

  useEffect(() => {
    if (isSetup && studentName) {
      generateSmartDigests()
    }
  }, [isSetup, studentName])

  // Add auto-refresh for real-time updates
  useEffect(() => {
    if (isSetup) {
      // Set up auto-refresh every 5 minutes
      const refreshInterval = setInterval(() => {
        generateDailyDigest()
      }, 5 * 60 * 1000) // 5 minutes in milliseconds
      
      // Clean up interval on component unmount
      return () => clearInterval(refreshInterval)
    }
  }, [isSetup])

  const generateSmartDigests = () => {
    const today = new Date()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const currentDay = dayNames[today.getDay()]
    const currentHour = today.getHours()
    const currentMinute = today.getMinutes()

    const todayClasses = timetable.filter((entry) => entry.day === currentDay)
    const digests: SmartDigest[] = []

    if (todayClasses.length > 0) {
      // Find the next class based on current time
      const upcomingClasses = todayClasses.filter(entry => {
        const [startHour, startMinute] = entry.time.split(' - ')[0].split(':').map(Number)
        return (startHour > currentHour) || (startHour === currentHour && startMinute > currentMinute)
      })

      const nextClass = upcomingClasses.length > 0 ? 
        upcomingClasses.sort((a, b) => {
          const [aStartHour, aStartMinute] = a.time.split(' - ')[0].split(':').map(Number)
          const [bStartHour, bStartMinute] = b.time.split(' - ')[0].split(':').map(Number)
          return (aStartHour - bStartHour) || (aStartMinute - bStartMinute)
        })[0] : todayClasses[0]

      // Morning greeting with first class
      digests.push({
        message: `Good morning ${studentName}! Your first class today is ${nextClass.subject} at ${nextClass.time} in ${nextClass.room}.`,
        type: "schedule",
        priority: "high",
        time: "8:00 AM",
      })

      // Bus route notification
      digests.push({
        message: `Bus Route 105 departs at 7:10 AM from Ghaziabad Old Bus Stand. Don't miss it!`,
        type: "reminder",
        priority: "medium",
        time: "7:00 AM",
      })

      // Add upcoming class notifications
      if (upcomingClasses.length > 0) {
        upcomingClasses.slice(0, 2).forEach((cls, index) => {
          digests.push({
            message: `Upcoming class: ${cls.subject} at ${cls.time} in ${cls.room}. ${index === 0 ? 'Get ready!' : 'Plan ahead!'}`,
            type: "schedule",
            priority: index === 0 ? "high" : "medium",
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          })
        })
      }

      // Lab classes notification
      const labClasses = todayClasses.filter((entry) => entry.type === "lab")
      if (labClasses.length > 0) {
        digests.push({
          message: `You have ${labClasses.length} lab session(s) today. Make sure to bring your laptop and lab manual.`,
          type: "suggestion",
          priority: "medium",
          time: "8:30 AM",
        })
      }
    } else {
      digests.push({
        message: `No classes scheduled for today, ${studentName}! Perfect time to catch up on assignments or visit the library.`,
        type: "suggestion",
        priority: "low",
        time: "9:00 AM",
      })
    }

    setSmartDigests(digests)
  }

  const setupProfile = async () => {
    if (!studentName || !department || !semester) return

    setIsLoading(true)
    // Simulate processing time
    setTimeout(() => {
      setIsSetup(true)
      setIsLoading(false)
      toast.success("🎉 Campus Buddy setup complete! Welcome to your personalized experience!")
    }, 1000)
  }

  const generateDailyDigest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-daily-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          department,
          semester,
          timetable,
        }),
      })

      const data = await response.json()
      if (data.success && data.digests) {
        setSmartDigests(data.digests)
      } else {
        // Fallback to local generation if API fails
        generateSmartDigests()
      }
    } catch (error) {
      console.error('Error generating digest:', error)
      // Fallback to local generation
      generateSmartDigests()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        />
        <div 
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        />
        <div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
        <div 
          className="absolute bottom-20 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl animate-bounce">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Smart Campus Buddy
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personalized AI companion for SRM IST NCR Ghaziabad. Get daily smart digests, study suggestions, and
            campus insights tailored to your academic journey.
          </p>
        </div>

        {!isSetup ? (
          /* Setup Form */
          <Card className="max-w-2xl mx-auto border-2 border-gradient-to-r from-blue-200 to-purple-200 shadow-2xl overflow-hidden group bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-500">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Bot className="h-6 w-6 text-blue-600 animate-bounce" />
                Setup Your Campus Buddy
              </CardTitle>
              <CardDescription className="text-blue-600">
                Tell us about yourself to get personalized AI assistance with your CSE Core timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-purple-700 font-medium">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Computer Science & Engineering"
                  className="border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-purple-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-green-700 font-medium">Current Semester</Label>
                <Input
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g., 5th Semester"
                  className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 hover:border-green-300"
                />
              </div>
              <Button
                onClick={setupProfile}
                disabled={isLoading || !studentName || !department || !semester}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Setting up your buddy...
                  </>
                ) : (
                  <>
                    <Bot className="h-5 w-5 mr-2 animate-pulse" />
                    Setup Campus Buddy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Main Dashboard */
          <Tabs defaultValue="digest" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-lg border-2 border-blue-200 shadow-lg">
              <TabsTrigger 
                value="digest" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Daily Digest
              </TabsTrigger>
              <TabsTrigger 
                value="timetable" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Timetable
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Study Resources
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="digest" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white">Today&apos;s Smart Digest</h2>
                <Button onClick={generateDailyDigest} disabled={isLoading} variant="outline">
                  {isLoading ? "Generating..." : "Refresh Digest"}
                </Button>
              </div>

              <div className="grid gap-4">
                {smartDigests.map((digest, index) => (
                  <Alert
                    key={index}
                    className={`border-l-4 ${
                      digest.priority === "high"
                        ? "border-l-red-500 bg-red-50"
                        : digest.priority === "medium"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                    }`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>{digest.message}</span>
                      <Badge variant="outline" className="text-xs">
                        {digest.time}
                      </Badge>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timetable" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse mb-2">
                  Your CSE Core Timetable
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  📚 Organized schedule with colorful indicators for lectures and labs
                </p>
                
                {/* Current Day Progress */}
                <div className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Today&apos;s Progress</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out animate-pulse"
                      style={{ width: `${Math.min(100, (new Date().getHours() / 24) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - Day in progress
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                {timetable.map((entry, index) => (
                  <Card 
                    key={index}
                    className="transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 hover:border-blue-300 overflow-hidden group bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInFromLeft 0.6s ease-out forwards'
                    }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-110 ${
                            entry.type === "lab"
                              ? "bg-gradient-to-br from-green-400 to-emerald-600 text-white animate-pulse"
                              : entry.type === "tutorial"
                                ? "bg-gradient-to-br from-yellow-400 to-orange-600 text-white animate-pulse"
                                : "bg-gradient-to-br from-blue-400 to-indigo-600 text-white animate-pulse"
                          }`}
                        >
                          {entry.type === "lab" ? (
                            <BookOpen className="h-5 w-5" />
                          ) : entry.type === "tutorial" ? (
                            <Lightbulb className="h-5 w-5" />
                          ) : (
                            <Calendar className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
                            {entry.subject}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-300">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{entry.time}</span> • 
                            <span className="font-medium text-purple-600">{entry.day}</span>
                            <MapPin className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-green-600">{entry.room}</span>
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={entry.type === "lab" ? "default" : "secondary"}
                        className={`font-bold text-xs px-3 py-1 ${
                          entry.type === "lab" 
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-pulse" 
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-pulse"
                        }`}
                      >
                        {entry.type.toUpperCase()}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div
                className="relative min-h-[600px] rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-16%20173720-RlbaSdbUhkRifEFkeLoPfI5FnviCjE.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-purple-600">THE HELPER</CardTitle>
                      <CardDescription>An Academic Tool Made For SRMIST</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-sm text-gray-600">
                        Access comprehensive Previous Year Questions (PYQs), study notes, and academic resources
                        specifically designed for SRM IST students.
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-purple-600 font-medium">
                          &ldquo;Where procrastination ends, and knowledge begins!&rdquo;
                        </p>
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => window.open("https://thehelpers.vercel.app/", "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Access Study Resources
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Buddy Settings
              </h2>
              <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 shadow-xl overflow-hidden group bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-500">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Bot className="h-5 w-5 text-blue-600 animate-bounce" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-blue-700 mb-2 block">Full Name</Label>
                      <p className="text-lg font-semibold text-blue-900">{studentName}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-purple-700 mb-2 block">Department</Label>
                      <p className="text-lg font-semibold text-purple-900">{department}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-green-700 mb-2 block">Current Semester</Label>
                      <p className="text-lg font-semibold text-green-900">{semester}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-orange-700 mb-2 block">Timetable</Label>
                      <p className="text-lg font-semibold text-orange-900">CSE Core - ODD SEM 2025-26</p>
                    </div>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSetup(false)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Bot className="h-4 w-4 mr-2 animate-pulse" />
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

  useEffect(() => {
    if (isSetup && studentName) {
      generateSmartDigests()
    }
  }, [isSetup, studentName])

  // Add auto-refresh for real-time updates
  useEffect(() => {
    if (isSetup) {
      // Set up auto-refresh every 5 minutes
      const refreshInterval = setInterval(() => {
        generateDailyDigest()
      }, 5 * 60 * 1000) // 5 minutes in milliseconds
      
      // Clean up interval on component unmount
      return () => clearInterval(refreshInterval)
    }
  }, [isSetup])

  const generateSmartDigests = () => {
    const today = new Date()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const currentDay = dayNames[today.getDay()]
    const currentHour = today.getHours()
    const currentMinute = today.getMinutes()

    const todayClasses = timetable.filter((entry) => entry.day === currentDay)
    const digests: SmartDigest[] = []

    if (todayClasses.length > 0) {
      // Find the next class based on current time
      const upcomingClasses = todayClasses.filter(entry => {
        const [startHour, startMinute] = entry.time.split(' - ')[0].split(':').map(Number)
        return (startHour > currentHour) || (startHour === currentHour && startMinute > currentMinute)
      })

      const nextClass = upcomingClasses.length > 0 ? 
        upcomingClasses.sort((a, b) => {
          const [aStartHour, aStartMinute] = a.time.split(' - ')[0].split(':').map(Number)
          const [bStartHour, bStartMinute] = b.time.split(' - ')[0].split(':').map(Number)
          return (aStartHour - bStartHour) || (aStartMinute - bStartMinute)
        })[0] : todayClasses[0]

      // Morning greeting with first class
      digests.push({
        message: `Good morning ${studentName}! Your first class today is ${nextClass.subject} at ${nextClass.time} in ${nextClass.room}.`,
        type: "schedule",
        priority: "high",
        time: "8:00 AM",
      })

      // Bus route notification
      digests.push({
        message: `Bus Route 105 departs at 7:10 AM from Ghaziabad Old Bus Stand. Don't miss it!`,
        type: "reminder",
        priority: "medium",
        time: "7:00 AM",
      })

      // Add upcoming class notifications
      if (upcomingClasses.length > 0) {
        upcomingClasses.slice(0, 2).forEach((cls, index) => {
          digests.push({
            message: `Upcoming class: ${cls.subject} at ${cls.time} in ${cls.room}. ${index === 0 ? 'Get ready!' : 'Plan ahead!'}`,
            type: "schedule",
            priority: index === 0 ? "high" : "medium",
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          })
        })
      }

      // Lab classes notification
      const labClasses = todayClasses.filter((entry) => entry.type === "lab")
      if (labClasses.length > 0) {
        digests.push({
          message: `You have ${labClasses.length} lab session(s) today. Make sure to bring your laptop and lab manual.`,
          type: "suggestion",
          priority: "medium",
          time: "8:30 AM",
        })
      }
    } else {
      digests.push({
        message: `No classes scheduled for today, ${studentName}! Perfect time to catch up on assignments or visit the library.`,
        type: "suggestion",
        priority: "low",
        time: "9:00 AM",
      })
    }

    setSmartDigests(digests)
  }

  const setupProfile = async () => {
    if (!studentName || !department || !semester) return

    setIsLoading(true)
    // Simulate processing time
    setTimeout(() => {
      setIsSetup(true)
      setIsLoading(false)
      toast.success("🎉 Campus Buddy setup complete! Welcome to your personalized experience!")
    }, 1000)
  }

  const generateDailyDigest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-daily-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          department,
          semester,
          timetable,
        }),
      })

      const data = await response.json()
      if (data.success && data.digests) {
        setSmartDigests(data.digests)
      } else {
        // Fallback to local generation if API fails
        generateSmartDigests()
      }
    } catch (error) {
      console.error('Error generating digest:', error)
      // Fallback to local generation
      generateSmartDigests()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        />
        <div 
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        />
        <div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
        <div 
          className="absolute bottom-20 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl animate-bounce">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Smart Campus Buddy
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personalized AI companion for SRM IST NCR Ghaziabad. Get daily smart digests, study suggestions, and
            campus insights tailored to your academic journey.
          </p>
        </div>

        {!isSetup ? (
          /* Setup Form */
          <Card className="max-w-2xl mx-auto border-2 border-gradient-to-r from-blue-200 to-purple-200 shadow-2xl overflow-hidden group bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-500">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Bot className="h-6 w-6 text-blue-600 animate-bounce" />
                Setup Your Campus Buddy
              </CardTitle>
              <CardDescription className="text-blue-600">
                Tell us about yourself to get personalized AI assistance with your CSE Core timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-purple-700 font-medium">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Computer Science & Engineering"
                  className="border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-purple-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-green-700 font-medium">Current Semester</Label>
                <Input
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g., 5th Semester"
                  className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 hover:border-green-300"
                />
              </div>
              <Button
                onClick={setupProfile}
                disabled={isLoading || !studentName || !department || !semester}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Setting up your buddy...
                  </>
                ) : (
                  <>
                    <Bot className="h-5 w-5 mr-2 animate-pulse" />
                    Setup Campus Buddy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Main Dashboard */
          <Tabs defaultValue="digest" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-lg border-2 border-blue-200 shadow-lg">
              <TabsTrigger 
                value="digest" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Daily Digest
              </TabsTrigger>
              <TabsTrigger 
                value="timetable" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Timetable
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Study Resources
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="digest" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white">Today&apos;s Smart Digest</h2>
                <Button onClick={generateDailyDigest} disabled={isLoading} variant="outline">
                  {isLoading ? "Generating..." : "Refresh Digest"}
                </Button>
              </div>

              <div className="grid gap-4">
                {smartDigests.map((digest, index) => (
                  <Alert
                    key={index}
                    className={`border-l-4 ${
                      digest.priority === "high"
                        ? "border-l-red-500 bg-red-50"
                        : digest.priority === "medium"
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-blue-500 bg-blue-50"
                    }`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>{digest.message}</span>
                      <Badge variant="outline" className="text-xs">
                        {digest.time}
                      </Badge>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timetable" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse mb-2">
                  Your CSE Core Timetable
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  📚 Organized schedule with colorful indicators for lectures and labs
                </p>
                
                {/* Current Day Progress */}
                <div className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Today&apos;s Progress</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out animate-pulse"
                      style={{ width: `${Math.min(100, (new Date().getHours() / 24) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - Day in progress
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                {timetable.map((entry, index) => (
                  <Card 
                    key={index}
                    className="transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 hover:border-blue-300 overflow-hidden group bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInFromLeft 0.6s ease-out forwards'
                    }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-110 ${
                            entry.type === "lab"
                              ? "bg-gradient-to-br from-green-400 to-emerald-600 text-white animate-pulse"
                              : entry.type === "tutorial"
                                ? "bg-gradient-to-br from-yellow-400 to-orange-600 text-white animate-pulse"
                                : "bg-gradient-to-br from-blue-400 to-indigo-600 text-white animate-pulse"
                          }`}
                        >
                          {entry.type === "lab" ? (
                            <BookOpen className="h-5 w-5" />
                          ) : entry.type === "tutorial" ? (
                            <Lightbulb className="h-5 w-5" />
                          ) : (
                            <Calendar className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
                            {entry.subject}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-300">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{entry.time}</span> • 
                            <span className="font-medium text-purple-600">{entry.day}</span>
                            <MapPin className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-green-600">{entry.room}</span>
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={entry.type === "lab" ? "default" : "secondary"}
                        className={`font-bold text-xs px-3 py-1 ${
                          entry.type === "lab" 
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-pulse" 
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-pulse"
                        }`}
                      >
                        {entry.type.toUpperCase()}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div
                className="relative min-h-[600px] rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-16%20173720-RlbaSdbUhkRifEFkeLoPfI5FnviCjE.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-purple-600">THE HELPER</CardTitle>
                      <CardDescription>An Academic Tool Made For SRMIST</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-sm text-gray-600">
                        Access comprehensive Previous Year Questions (PYQs), study notes, and academic resources
                        specifically designed for SRM IST students.
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-purple-600 font-medium">
                          &ldquo;Where procrastination ends, and knowledge begins!&rdquo;
                        </p>
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => window.open("https://thehelpers.vercel.app/", "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Access Study Resources
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Buddy Settings
              </h2>
              <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 shadow-xl overflow-hidden group bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-500">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Bot className="h-5 w-5 text-blue-600 animate-bounce" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-blue-700 mb-2 block">Full Name</Label>
                      <p className="text-lg font-semibold text-blue-900">{studentName}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-purple-700 mb-2 block">Department</Label>
                      <p className="text-lg font-semibold text-purple-900">{department}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-green-700 mb-2 block">Current Semester</Label>
                      <p className="text-lg font-semibold text-green-900">{semester}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <Label className="text-sm font-medium text-orange-700 mb-2 block">Timetable</Label>
                      <p className="text-lg font-semibold text-orange-900">CSE Core - ODD SEM 2025-26</p>
                    </div>
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSetup(false)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Bot className="h-4 w-4 mr-2 animate-pulse" />
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

  useEffect(() => {
    if (isSetup && studentName) {
      generateSmartDigests()
    }
  }, [isSetup, studentName])

  const generateDailyDigest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-daily-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          department,
          semester,
          timetable,
        }),
      })

      const data = await response.json()
      if (data.success && data.digests) {
        setSmartDigests(data.digests)
      } else {
        // Fallback to local generation if API fails
        generateSmartDigests()
      }
    } catch (error) {
      console.error('Error generating digest:', error)
      // Fallback to local generation
      generateSmartDigests()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        />
        <div 
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        />
        <div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
        <div 
          className="absolute bottom-20 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl animate-bounce">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Smart Campus Buddy
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personalized AI companion for SRM IST NCR Ghaziabad. Get daily smart digests, study suggestions, and
            campus insights tailored to your academic journey.
          </p>
        </div>

        {!isSetup ? (
          /* Setup Form */
          <Card className="max-w-2xl mx-auto border-2 border-gradient-to-r from-blue-200 to-purple-200 shadow-2xl overflow-hidden group bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-500">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Bot className="h-6 w-6 text-blue-600 animate-bounce" />
                Setup Your Campus Buddy
              </CardTitle>
              <CardDescription className="text-blue-600">
                Tell us about yourself to get personalized AI assistance with your CSE Core timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-blue-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-purple-700 font-medium">Department</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Computer Science & Engineering"
                  className="border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 hover:border-purple-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-green-700 font-medium">Current Semester</Label>
                <Input
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g., 5th Semester"
                  className="border-2 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-300 hover:border-green-300"
                />
              </div>
              <Button
                onClick={setupProfile}
                disabled={isLoading || !studentName || !department || !semester}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Setting up your buddy...
                  </>
                ) : (
                  <>
                    <Bot
