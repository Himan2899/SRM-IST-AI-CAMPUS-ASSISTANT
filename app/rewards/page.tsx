"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Trophy, Star, Code, Github, Zap, Target, Brain, ExternalLink, AlertCircle } from "lucide-react"
import Link from "next/link"

interface CodeProfile {
  leetcodeUsername: string
  githubUsername: string
  leetcodeSolved: number
  githubRepos: number
  lastUpdated: Date
}

interface Achievement {
  id: string
  name: string
  description: string
  category: "leetcode" | "github" | "combined"
  requirement: number
  progress: number
  completed: boolean
  icon: React.ComponentType<{ className?: string }>
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface NFTBadge {
  id: string
  name: string
  description: string
  imageUrl: string
  mintedAt: Date
  category: string
}

export default function RewardsPage() {
  const [profile, setProfile] = useState<CodeProfile | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [leetcodeInput, setLeetcodeInput] = useState("")
  const [githubInput, setGithubInput] = useState("")
  const [nftBadges, setNftBadges] = useState<NFTBadge[]>([])
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAchievements = (profile: CodeProfile): Achievement[] => {
    return [
      {
        id: "lc_beginner",
        name: "LeetCode Beginner",
        description: "Solve your first 10 LeetCode problems",
        category: "leetcode",
        requirement: 10,
        progress: Math.min(profile.leetcodeSolved, 10),
        completed: profile.leetcodeSolved >= 10,
        icon: Code,
        rarity: "common",
      },
      {
        id: "lc_intermediate",
        name: "Problem Solver",
        description: "Solve 50 LeetCode problems",
        category: "leetcode",
        requirement: 50,
        progress: Math.min(profile.leetcodeSolved, 50),
        completed: profile.leetcodeSolved >= 50,
        icon: Target,
        rarity: "rare",
      },
      {
        id: "lc_advanced",
        name: "Coding Master",
        description: "Solve 100 LeetCode problems",
        category: "leetcode",
        requirement: 100,
        progress: Math.min(profile.leetcodeSolved, 100),
        completed: profile.leetcodeSolved >= 100,
        icon: Trophy,
        rarity: "epic",
      },
      {
        id: "lc_expert",
        name: "Algorithm Expert",
        description: "Solve 200+ LeetCode problems",
        category: "leetcode",
        requirement: 200,
        progress: Math.min(profile.leetcodeSolved, 200),
        completed: profile.leetcodeSolved >= 200,
        icon: Brain,
        rarity: "legendary",
      },
      {
        id: "gh_starter",
        name: "GitHub Starter",
        description: "Create your first 3 GitHub repositories",
        category: "github",
        requirement: 3,
        progress: Math.min(profile.githubRepos, 3),
        completed: profile.githubRepos >= 3,
        icon: Github,
        rarity: "common",
      },
      {
        id: "gh_developer",
        name: "Active Developer",
        description: "Maintain 10 GitHub repositories",
        category: "github",
        requirement: 10,
        progress: Math.min(profile.githubRepos, 10),
        completed: profile.githubRepos >= 10,
        icon: Code,
        rarity: "rare",
      },
      {
        id: "gh_contributor",
        name: "Open Source Contributor",
        description: "Create 20+ GitHub repositories",
        category: "github",
        requirement: 20,
        progress: Math.min(profile.githubRepos, 20),
        completed: profile.githubRepos >= 20,
        icon: Star,
        rarity: "epic",
      },
      {
        id: "combined_achiever",
        name: "Full Stack Achiever",
        description: "50+ LeetCode problems AND 10+ GitHub repos",
        category: "combined",
        requirement: 1,
        progress: profile.leetcodeSolved >= 50 && profile.githubRepos >= 10 ? 1 : 0,
        completed: profile.leetcodeSolved >= 50 && profile.githubRepos >= 10,
        icon: Award,
        rarity: "legendary",
      },
    ]
  }

  const fetchProfile = async () => {
    if (!leetcodeInput && !githubInput) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/fetch-coding-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leetcodeUsername: leetcodeInput,
          githubUsername: githubInput,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }))

        if (response.status === 429) {
          setError(
            "GitHub API rate limit exceeded. Please try again in an hour, or contact the administrator to add a GitHub token for higher limits.",
          )
        } else if (response.status === 404) {
          setError(errorData.error || "User not found. Please check your username and try again.")
        } else {
          setError(errorData.error || `API error (${response.status}). Please try again later.`)
        }
        return
      }

      const data = await response.json()
      const newProfile: CodeProfile = {
        leetcodeUsername: leetcodeInput,
        githubUsername: githubInput,
        leetcodeSolved: data.leetcodeSolved || 0,
        githubRepos: data.githubRepos || 0,
        lastUpdated: new Date(),
      }

      setProfile(newProfile)
      setAchievements(generateAchievements(newProfile))
    } catch (error) {
      console.error("Profile fetch error:", error)
      setError("Failed to connect to the server. Please check your internet connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const mintNFTBadge = async (achievement: Achievement) => {
    if (!achievement.completed) return

    setIsMinting(true)
    try {
      const response = await fetch("/api/mint-coding-nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievementId: achievement.id,
          profile: profile,
          achievement: achievement,
        }),
      })

      if (!response.ok) throw new Error("Minting failed")

      const result = await response.json()
      setNftBadges((prev) => [...prev, result.badge])
    } catch (error) {
      console.error("NFT minting error:", error)
    } finally {
      setIsMinting(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50"
      case "rare":
        return "border-blue-300 bg-blue-50"
      case "epic":
        return "border-purple-300 bg-purple-50"
      case "legendary":
        return "border-yellow-300 bg-yellow-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "secondary"
      case "rare":
        return "default"
      case "epic":
        return "secondary"
      case "legendary":
        return "default"
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
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">SRM IST AI Assistant</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">NFT Coding Rewards</p>
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
            <Award className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">NFT Coding Rewards</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Earn blockchain badges based on your LeetCode problem-solving skills and GitHub project contributions.
          </p>
        </div>

        {/* Profile Setup */}
        {!profile && (
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Connect Your Coding Profiles
              </CardTitle>
              <CardDescription>
                Link your LeetCode and GitHub profiles to start earning NFT badges based on your coding achievements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leetcode">LeetCode Username</Label>
                  <Input
                    id="leetcode"
                    placeholder="your-leetcode-username"
                    value={leetcodeInput}
                    onChange={(e) => setLeetcodeInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Username</Label>
                  <Input
                    id="github"
                    placeholder="your-github-username"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={fetchProfile}
                disabled={isLoading || (!leetcodeInput && !githubInput)}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Fetching Profile Data...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Profiles
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Stats */}
        {profile && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Code className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{profile.leetcodeSolved}</div>
                  <div className="text-sm text-gray-600">LeetCode Problems</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Github className="h-8 w-8 text-gray-700 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{profile.githubRepos}</div>
                  <div className="text-sm text-gray-600">GitHub Repositories</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{nftBadges.length}</div>
                  <div className="text-sm text-gray-600">NFT Badges Earned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{achievements.filter((a) => a.completed).length}</div>
                  <div className="text-sm text-gray-600">Achievements Unlocked</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="collection">My NFT Collection</TabsTrigger>
              </TabsList>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon
                    return (
                      <Card key={achievement.id} className={`${getRarityColor(achievement.rarity)} border-2`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{achievement.name}</CardTitle>
                                <Badge variant={getRarityBadgeColor(achievement.rarity)} className="text-xs capitalize">
                                  {achievement.rarity}
                                </Badge>
                              </div>
                            </div>
                            {achievement.completed && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                          </div>
                          <CardDescription>{achievement.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>
                                {achievement.progress}/{achievement.requirement}
                              </span>
                            </div>
                            <Progress value={(achievement.progress / achievement.requirement) * 100} className="h-2" />
                          </div>
                          {achievement.completed && (
                            <Button
                              onClick={() => mintNFTBadge(achievement)}
                              disabled={isMinting}
                              className="w-full"
                              size="sm"
                            >
                              {isMinting ? (
                                <>
                                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                                  Minting...
                                </>
                              ) : (
                                <>
                                  <Award className="h-4 w-4 mr-2" />
                                  Mint NFT Badge
                                </>
                              )}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Collection Tab */}
              <TabsContent value="collection" className="mt-6">
                {nftBadges.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No NFT Badges Yet</h3>
                      <p className="text-gray-600 mb-4">Complete achievements to earn your first NFT coding badges!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nftBadges.map((badge) => (
                      <Card key={badge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Award className="h-16 w-16 text-yellow-500" />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {badge.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
