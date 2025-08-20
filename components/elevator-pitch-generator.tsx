"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Sparkles, Mic, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface ElevatorPitchForm {
  name: string
  degree: string
  skills: string
  projects: string
  achievements: string
}

export default function ElevatorPitchGenerator() {
  const [formData, setFormData] = useState<ElevatorPitchForm>({
    name: "",
    degree: "",
    skills: "",
    projects: "",
    achievements: ""
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPitch, setGeneratedPitch] = useState("")
  const [copied, setCopied] = useState(false)

  const handleInputChange = (field: keyof ElevatorPitchForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.degree || !formData.skills || !formData.projects) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/generate-elevator-pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedPitch(data.pitch)
        toast.success("Elevator pitch generated successfully!")
      } else {
        toast.error(data.error || "Failed to generate pitch")
      }
    } catch (error) {
      console.error("Error generating pitch:", error)
      toast.error("Failed to generate elevator pitch")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPitch)
      setCopied(true)
      toast.success("Pitch copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const isFormValid = formData.name && formData.degree && formData.skills && formData.projects

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-white/80 border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Mic className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-800">Quick Elevator Pitch Generator</CardTitle>
              <CardDescription className="text-blue-600">
                Generate a professional 30-60 second elevator pitch for your interviews
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="degree" className="text-sm font-medium text-gray-700">
                  Degree/Branch <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="degree"
                  placeholder="e.g., B.Tech Computer Science"
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                Technical Skills <span className="text-red-500">*</span>
              </Label>
              <Input
                id="skills"
                placeholder="e.g., React, Node.js, Python, AWS, Docker"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Separate skills with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projects" className="text-sm font-medium text-gray-700">
                Projects <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="projects"
                placeholder="e.g., E-commerce Platform - Built full-stack web app with React & Node.js, deployed on AWS with 1000+ users"
                value={formData.projects}
                onChange={(e) => handleInputChange("projects", e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
              />
              <p className="text-xs text-gray-500">Include project title and brief description</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements" className="text-sm font-medium text-gray-700">
                Achievements/Internships (Optional)
              </Label>
              <Textarea
                id="achievements"
                placeholder="e.g., Google Summer of Code participant, Dean's List 3 semesters, Intern at Microsoft"
                value={formData.achievements}
                onChange={(e) => handleInputChange("achievements", e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
              />
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Pitch...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Elevator Pitch
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedPitch && (
        <Card className="backdrop-blur-sm bg-white/80 border-2 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-green-800">Generated Elevator Pitch</CardTitle>
                  <CardDescription className="text-green-600">
                    Your professional 30-60 second pitch
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {generatedPitch}
              </p>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {Math.ceil(generatedPitch.split(' ').length / 2.5)} seconds estimated
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Professional tone
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Interview ready
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
