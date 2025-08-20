"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Brain, Send, Activity, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { SentimentAnalysis, CrisisAlert } from "@/lib/types"

export default function CrisisDetectionPage() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null)
  const [alerts, setAlerts] = useState<CrisisAlert[]>([])
  const [dailyStats, setDailyStats] = useState({
    analyzed: 0,
    highRisk: 0,
    helped: 0,
  })

  // Real-time alerts will be populated only when students actually submit concerning messages
  useEffect(() => {
    // Placeholder for fetching real-time alerts from an API
    // setAlerts(mockAlerts)
  }, [])

  const analyzeSentiment = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const result = await response.json()
      setAnalysis(result)

      setDailyStats((prev) => ({
        ...prev,
        analyzed: prev.analyzed + 1,
        highRisk: result.riskLevel === "high" ? prev.highRisk + 1 : prev.highRisk,
      }))

      // If high risk detected, create real alert
      if (result.riskLevel === "high" || result.riskLevel === "medium") {
        const newAlert: CrisisAlert = {
          id: Date.now().toString(),
          studentId: `SRM_${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // SRM student ID format
          message: inputText,
          sentiment: result.sentiment,
          confidence: result.confidence,
          riskLevel: result.riskLevel,
          timestamp: new Date(),
          status: "pending",
        }
        setAlerts((prev) => [newAlert, ...prev])

        if (result.riskLevel === "high") {
          setTimeout(() => {
            setAlerts((current) =>
              current.map((alert) => (alert.id === newAlert.id ? { ...alert, status: "escalated" } : alert)),
            )
          }, 2000)
        }
      }
    } catch (error) {
      console.error("Sentiment analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      case "neutral":
        return "text-gray-600"
      default:
        return "text-gray-600"
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
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">SRM IST AI Assistant</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Crisis Detection</p>
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
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Crisis Detection System</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered sentiment analysis to identify SRM IST students who may need support and intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analysis Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Live Sentiment Analysis
                </CardTitle>
                <CardDescription>
                  Enter your message to analyze emotional state and get support if needed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share how you're feeling today, any concerns about studies, campus life, or personal matters..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button onClick={analyzeSentiment} disabled={isAnalyzing || !inputText.trim()} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Analyze My Message
                    </>
                  )}
                </Button>

                {/* Analysis Results */}
                {analysis && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Sentiment:</span>
                        <span className={`font-semibold capitalize ${getSentimentColor(analysis.sentiment)}`}>
                          {analysis.sentiment}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Confidence:</span>
                        <span className="font-semibold">{(analysis.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Risk Level:</span>
                        <Badge variant={getRiskColor(analysis.riskLevel)} className="capitalize">
                          {analysis.riskLevel}
                        </Badge>
                      </div>
                      {analysis.keywords && analysis.keywords.length > 0 && (
                        <div>
                          <span className="font-medium">Key Indicators:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {(analysis.riskLevel === "high" || analysis.riskLevel === "medium") && (
                        <Alert className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Support Available:</strong> If you're going through a difficult time, please reach
                            out to SRM IST Student Counseling Services at +91-120-4570000 or visit the Student Welfare
                            Office in the Administrative Block.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats & Alerts */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages Analyzed</span>
                  <span className="font-semibold">{dailyStats.analyzed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Alerts</span>
                  <span className="font-semibold text-red-600">{dailyStats.highRisk}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Support Offered</span>
                  <span className="font-semibold text-green-600">{alerts.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No alerts yet. Submit a message above to test the system.
                  </p>
                ) : (
                  alerts.slice(0, 3).map((alert) => (
                    <Alert key={alert.id} className="p-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={getRiskColor(alert.riskLevel)} className="text-xs">
                            {alert.riskLevel} risk
                          </Badge>
                          <span className="text-xs text-gray-500">{alert.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm">{alert.message.substring(0, 60)}...</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">ID: {alert.studentId}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.status}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                )}
                {alerts.length > 3 && (
                  <Button variant="outline" className="w-full text-sm bg-transparent">
                    View All Alerts ({alerts.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
