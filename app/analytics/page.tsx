"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { BarChart3, TrendingUp, AlertTriangle, Brain, Target, Zap } from "lucide-react"
import Link from "next/link"
import type { AnalyticsData } from "@/lib/types"

interface PredictionData {
  metric: string
  current: number
  predicted: number
  confidence: number
  trend: "up" | "down" | "stable"
  risk: "low" | "medium" | "high"
}

interface StudentRiskProfile {
  id: string
  name: string
  department: string
  riskScore: number
  factors: string[]
  recommendations: string[]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  const [riskProfiles, setRiskProfiles] = useState<StudentRiskProfile[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Mock analytics data
    const mockData: AnalyticsData[] = [
      {
        attendanceRate: 92,
        engagementScore: 85,
        alertsCount: 3,
        energyUsage: 78,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        attendanceRate: 89,
        engagementScore: 82,
        alertsCount: 5,
        energyUsage: 82,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        attendanceRate: 94,
        engagementScore: 88,
        alertsCount: 2,
        energyUsage: 75,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        attendanceRate: 91,
        engagementScore: 86,
        alertsCount: 4,
        energyUsage: 79,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        attendanceRate: 96,
        engagementScore: 91,
        alertsCount: 1,
        energyUsage: 73,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        attendanceRate: 93,
        engagementScore: 89,
        alertsCount: 2,
        energyUsage: 76,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        attendanceRate: 95,
        engagementScore: 92,
        alertsCount: 1,
        energyUsage: 74,
        timestamp: new Date(),
      },
    ]
    setAnalyticsData(mockData)

    // Mock predictions
    const mockPredictions: PredictionData[] = [
      {
        metric: "Attendance Rate",
        current: 93,
        predicted: 89,
        confidence: 0.87,
        trend: "down",
        risk: "medium",
      },
      {
        metric: "Engagement Score",
        current: 89,
        predicted: 94,
        confidence: 0.92,
        trend: "up",
        risk: "low",
      },
      {
        metric: "Crisis Alerts",
        current: 2,
        predicted: 5,
        confidence: 0.78,
        trend: "up",
        risk: "high",
      },
      {
        metric: "Energy Usage",
        current: 76,
        predicted: 71,
        confidence: 0.85,
        trend: "down",
        risk: "low",
      },
    ]
    setPredictions(mockPredictions)

    // Mock risk profiles
    const mockRiskProfiles: StudentRiskProfile[] = [
      {
        id: "student_005",
        name: "David Kim",
        department: "Engineering",
        riskScore: 85,
        factors: ["Low attendance (78%)", "Declining grades", "Missed counseling appointments"],
        recommendations: ["Schedule academic support", "Increase check-ins", "Peer mentoring program"],
      },
      {
        id: "student_006",
        name: "Lisa Wang",
        department: "Business",
        riskScore: 72,
        factors: ["Social isolation indicators", "Reduced campus engagement"],
        recommendations: ["Social activities invitation", "Study group matching"],
      },
      {
        id: "student_007",
        name: "Carlos Martinez",
        department: "Arts",
        riskScore: 68,
        factors: ["Financial stress indicators", "Part-time work conflicts"],
        recommendations: ["Financial aid consultation", "Flexible scheduling options"],
      },
    ]
    setRiskProfiles(mockRiskProfiles)
  }, [timeRange])

  const generatePredictions = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeRange, data: analyticsData }),
      })

      if (!response.ok) throw new Error("Prediction generation failed")

      const result = await response.json()
      setPredictions(result.predictions)
    } catch (error) {
      console.error("Prediction generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const chartData = analyticsData.map((data, index) => ({
    day: `Day ${index + 1}`,
    attendance: data.attendanceRate,
    engagement: data.engagementScore,
    alerts: data.alertsCount,
    energy: data.energyUsage,
  }))

  const departmentData = [
    { name: "Computer Science", students: 245, engagement: 89, color: "#3b82f6" },
    { name: "Engineering", students: 198, engagement: 85, color: "#10b981" },
    { name: "Business", students: 167, engagement: 82, color: "#f59e0b" },
    { name: "Arts", students: 134, engagement: 78, color: "#ef4444" },
    { name: "Sciences", students: 156, engagement: 86, color: "#8b5cf6" },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Predictive Analytics</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Predictive Analytics</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI-powered insights for student success and campus optimization.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generatePredictions} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Predictions
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance & Engagement Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance & Engagement Trends</CardTitle>
                  <CardDescription>Student performance metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      attendance: { label: "Attendance", color: "#3b82f6" },
                      engagement: { label: "Engagement", color: "#10b981" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Crisis Alerts & Energy Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Energy Usage</CardTitle>
                  <CardDescription>Campus safety and sustainability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      alerts: { label: "Crisis Alerts", color: "#ef4444" },
                      energy: { label: "Energy Usage", color: "#f59e0b" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="alerts" stackId="1" stroke="#ef4444" fill="#ef4444" />
                        <Area type="monotone" dataKey="energy" stackId="2" stroke="#f59e0b" fill="#f59e0b" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictions.map((prediction) => (
                <Card key={prediction.metric}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{prediction.metric}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(prediction.trend)}
                        <Badge variant={getRiskColor(prediction.risk)}>{prediction.risk} risk</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Current</div>
                        <div className="text-2xl font-bold">{prediction.current}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Predicted</div>
                        <div className="text-2xl font-bold">{prediction.predicted}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="font-semibold">{(prediction.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk-analysis" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    High-Risk Students
                  </CardTitle>
                  <CardDescription>Students identified as needing additional support</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskProfiles.map((profile) => (
                      <Card key={profile.id} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{profile.name}</h3>
                              <p className="text-sm text-gray-600">{profile.department}</p>
                            </div>
                            <Badge variant="destructive">Risk Score: {profile.riskScore}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Risk Factors:</h4>
                              <ul className="text-sm space-y-1">
                                {profile.factors.map((factor, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-500 rounded-full" />
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
                              <ul className="text-sm space-y-1">
                                {profile.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Distribution by Department</CardTitle>
                  <CardDescription>Current enrollment across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      students: { label: "Students" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="students"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Department Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement by Department</CardTitle>
                  <CardDescription>Average engagement scores across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      engagement: { label: "Engagement Score", color: "#3b82f6" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="engagement" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
