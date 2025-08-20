"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, FileText, Sparkles, CheckCircle, Edit3 } from "lucide-react"
import { toast } from "sonner"

interface CoverLetterForm {
  name: string
  degree: string
  skills: string
  projects: string
  achievements: string
  jobDescription: string
}

export default function CoverLetterGenerator() {
  const [formData, setFormData] = useState<CoverLetterForm>({
    name: "",
    degree: "",
    skills: "",
    projects: "",
    achievements: "",
    jobDescription: ""
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("")
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (field: keyof CoverLetterForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.degree || !formData.skills || !formData.projects || !formData.jobDescription) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedCoverLetter(data.coverLetter)
        setIsEditing(false)
        toast.success("Cover letter generated successfully!")
      } else {
        toast.error(data.error || "Failed to generate cover letter")
      }
    } catch (error) {
      console.error("Error generating cover letter:", error)
      toast.error("Failed to generate cover letter")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCoverLetter)
      setCopied(true)
      toast.success("Cover letter copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const downloadAsPDF = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedCoverLetter], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${formData.name}-CoverLetter.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Cover letter downloaded!")
  }

  const handleCoverLetterEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedCoverLetter(e.target.value)
  }

  const isFormValid = formData.name && formData.degree && formData.skills && formData.projects && formData.jobDescription

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-white/80 border-2 border-purple-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-purple-800">AI Cover Letter in 1 Click</CardTitle>
              <CardDescription className="text-purple-600">
                Generate a professional cover letter tailored to any job description
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
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[80px]"
              />
              <p className="text-xs text-gray-500">Include project title and brief description</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements" className="text-sm font-medium text-gray-700">
                Achievements/Experience (Optional)
              </Label>
              <Textarea
                id="achievements"
                placeholder="e.g., Google Summer of Code participant, Dean's List 3 semesters, Intern at Microsoft"
                value={formData.achievements}
                onChange={(e) => handleInputChange("achievements", e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
                Job Description (JD) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here to tailor your cover letter..."
                value={formData.jobDescription}
                onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 min-h-[120px]"
              />
              <p className="text-xs text-gray-500">The more detailed the JD, the better tailored your cover letter will be</p>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate AI Cover Letter
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedCoverLetter && (
        <Card className="backdrop-blur-sm bg-white/80 border-2 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-green-800">Generated Cover Letter</CardTitle>
                  <CardDescription className="text-green-600">
                    Your professional, tailored cover letter
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? "Done Editing" : "Edit"}
                </Button>
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
                <Button
                  onClick={downloadAsPDF}
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {isEditing ? (
                <Textarea
                  value={generatedCoverLetter}
                  onChange={handleCoverLetterEdit}
                  className="min-h-[300px] border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="Your cover letter will appear here..."
                />
              ) : (
                <div className="min-h-[300px]">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {generatedCoverLetter}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {generatedCoverLetter.split(' ').length} words
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Professional tone
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Job tailored
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Ready to submit
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
