// Core types for the AI Campus Assistant

export interface Student {
  id: string
  name: string
  email: string
  studentId: string
  department: string
  year: number
  attendance: number
  engagementScore: number
  nftBadges: NFTBadge[]
}

export interface CrisisAlert {
  id: string
  studentId: string
  message: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  riskLevel: "low" | "medium" | "high"
  timestamp: Date
  status: "pending" | "acknowledged" | "escalated" | "resolved"
  counselorId?: string
}

export interface LostItem {
  id: string
  title: string
  description: string
  imageUrl: string
  location: string
  dateReported: Date
  status: "lost" | "found" | "claimed"
  reportedBy: string
  contactInfo: string
}

export interface NFTBadge {
  id: string
  name: string
  description: string
  imageUrl: string
  contractAddress: string
  tokenId: string
  mintedAt: Date
  category: "attendance" | "engagement" | "achievement" | "participation"
}

export interface VoiceQuery {
  id: string
  query: string
  response: string
  timestamp: Date
  userId: string
  confidence: number
}

export interface SentimentAnalysis {
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  riskLevel: "low" | "medium" | "high"
  keywords?: string[]
  explanation?: string
}

export interface CampusBuilding {
  id: string
  name: string
  position: [number, number, number] // x, y, z coordinates
  type: "academic" | "residential" | "administrative" | "recreational"
  alerts: IoTAlert[]
}

export interface IoTAlert {
  id: string
  buildingId: string
  type: "gas_leak" | "fire" | "security" | "maintenance"
  message: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  resolved: boolean
}

export interface AnalyticsData {
  attendanceRate: number
  engagementScore: number
  alertsCount: number
  energyUsage: number
  timestamp: Date
}
