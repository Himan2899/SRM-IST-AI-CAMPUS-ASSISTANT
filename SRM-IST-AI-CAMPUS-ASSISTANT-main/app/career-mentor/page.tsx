"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Code, 
  Shield, 
  Database, 
  Smartphone, 
  Globe, 
  Zap, 
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Lightbulb,
  Award,
  Rocket,
  Palette,
  Music,
  Gamepad2,
  Camera,
  Heart,
  Globe2,
  Cpu,
  Network,
  Mic,
  FileText
} from "lucide-react"
import ElevatorPitchGenerator from "@/components/elevator-pitch-generator"
import CoverLetterGenerator from "@/components/cover-letter-generator"

interface QuizQuestion {
  id: number
  question: string
  options: {
    text: string
    value: string
    icon: React.ReactNode
    color: string
  }[]
}

interface CareerPath {
  title: string
  description: string
  icon: React.ReactNode
  matchScore: number
  skills: string[]
  salary: string
  growth: string
  companies: string[]
  color: string
  bgColor: string
}

export default function CareerMentorPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [careerRecommendations, setCareerRecommendations] = useState<CareerPath[]>([])
  const [showResults, setShowResults] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [activeView, setActiveView] = useState<'quiz' | 'elevator-pitch' | 'cover-letter'>('quiz')

  // Add floating animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What type of problems do you enjoy solving the most?",
      options: [
        { text: "Mathematical and statistical problems", value: "analytical", icon: <Brain className="h-5 w-5" />, color: "#3B82F6" },
        { text: "Building and creating things", value: "creative", icon: <Code className="h-5 w-5" />, color: "#10B981" },
        { text: "Protecting and securing systems", value: "security", icon: <Shield className="h-5 w-5" />, color: "#EF4444" },
        { text: "Organizing and managing data", value: "organizational", icon: <Database className="h-5 w-5" />, color: "#8B5CF6" }
      ]
    },
    {
      id: 2,
      question: "How do you prefer to work?",
      options: [
        { text: "Independently on focused tasks", value: "independent", icon: <Target className="h-5 w-5" />, color: "#F59E0B" },
        { text: "Collaborating with a team", value: "collaborative", icon: <Users className="h-5 w-5" />, color: "#EC4899" },
        { text: "Fast-paced, dynamic environment", value: "dynamic", icon: <Zap className="h-5 w-5" />, color: "#06B6D4" },
        { text: "Structured, methodical approach", value: "structured", icon: <CheckCircle className="h-5 w-5" />, color: "#84CC16" }
      ]
    },
    {
      id: 3,
      question: "What subjects did you enjoy most in school?",
      options: [
        { text: "Mathematics and Statistics", value: "math", icon: <Brain className="h-5 w-5" />, color: "#3B82F6" },
        { text: "Computer Science and Programming", value: "programming", icon: <Code className="h-5 w-5" />, color: "#10B981" },
        { text: "Physics and Engineering", value: "engineering", icon: <Rocket className="h-5 w-5" />, color: "#F59E0B" },
        { text: "Business and Economics", value: "business", icon: <TrendingUp className="h-5 w-5" />, color: "#8B5CF6" }
      ]
    },
    {
      id: 4,
      question: "What kind of technology interests you most?",
      options: [
        { text: "Mobile apps and user interfaces", value: "mobile", icon: <Smartphone className="h-5 w-5" />, color: "#8B5CF6" },
        { text: "Web development and online platforms", value: "web", icon: <Globe className="h-5 w-5" />, color: "#06B6D4" },
        { text: "Artificial Intelligence and Machine Learning", value: "ai", icon: <Brain className="h-5 w-5" />, color: "#EC4899" },
        { text: "Cybersecurity and network protection", value: "cybersecurity", icon: <Shield className="h-5 w-5" />, color: "#EF4444" }
      ]
    },
    {
      id: 5,
      question: "What's your ideal work environment?",
      options: [
        { text: "Startup with rapid innovation", value: "startup", icon: <Rocket className="h-5 w-5" />, color: "#F59E0B" },
        { text: "Large tech company with resources", value: "bigtech", icon: <Star className="h-5 w-5" />, color: "#3B82F6" },
        { text: "Consulting with diverse projects", value: "consulting", icon: <Users className="h-5 w-5" />, color: "#EC4899" },
        { text: "Research and development lab", value: "research", icon: <Lightbulb className="h-5 w-5" />, color: "#84CC16" }
      ]
    },
    {
      id: 6,
      question: "What motivates you most in your career?",
      options: [
        { text: "Solving complex technical challenges", value: "technical", icon: <Code className="h-5 w-5" />, color: "#10B981" },
        { text: "Making a positive impact on society", value: "impact", icon: <Award className="h-5 w-5" />, color: "#EF4444" },
        { text: "High salary and financial growth", value: "financial", icon: <TrendingUp className="h-5 w-5" />, color: "#8B5CF6" },
        { text: "Continuous learning and innovation", value: "learning", icon: <Brain className="h-5 w-5" />, color: "#3B82F6" }
      ]
    },
    // NEW INNOVATIVE QUESTIONS
    {
      id: 7,
      question: "How do you express your creativity?",
      options: [
        { text: "Through visual design and art", value: "visual", icon: <Palette className="h-5 w-5" />, color: "#EC4899" },
        { text: "By composing music and sound", value: "audio", icon: <Music className="h-5 w-5" />, color: "#06B6D4" },
        { text: "In game design and storytelling", value: "gaming", icon: <Gamepad2 className="h-5 w-5" />, color: "#8B5CF6" },
        { text: "Through photography and media", value: "media", icon: <Camera className="h-5 w-5" />, color: "#F59E0B" }
      ]
    },
    {
      id: 8,
      question: "What kind of impact do you want to make?",
      options: [
        { text: "Improve healthcare and save lives", value: "healthcare", icon: <Heart className="h-5 w-5" />, color: "#EF4444" },
        { text: "Connect people globally", value: "connectivity", icon: <Globe2 className="h-5 w-5" />, color: "#3B82F6" },
        { text: "Advance artificial intelligence", value: "ai_advancement", icon: <Cpu className="h-5 w-5" />, color: "#EC4899" },
        { text: "Build secure digital infrastructure", value: "infrastructure", icon: <Network className="h-5 w-5" />, color: "#10B981" }
      ]
    },
    {
      id: 9,
      question: "How do you handle failure and setbacks?",
      options: [
        { text: "Analyze and learn from mistakes", value: "analytical_learning", icon: <Brain className="h-5 w-5" />, color: "#3B82F6" },
        { text: "Quickly adapt and try new approaches", value: "adaptive", icon: <Zap className="h-5 w-5" />, color: "#06B6D4" },
        { text: "Collaborate with others for solutions", value: "collaborative_solving", icon: <Users className="h-5 w-5" />, color: "#EC4899" },
        { text: "Systematically debug and fix issues", value: "systematic_debugging", icon: <CheckCircle className="h-5 w-5" />, color: "#84CC16" }
      ]
    },
    {
      id: 10,
      question: "What excites you about the future of technology?",
      options: [
        { text: "Quantum computing breakthroughs", value: "quantum", icon: <Cpu className="h-5 w-5" />, color: "#8B5CF6" },
        { text: "Sustainable and green tech", value: "green_tech", icon: <Globe className="h-5 w-5" />, color: "#10B981" },
        { text: "Virtual and augmented reality", value: "vr_ar", icon: <Gamepad2 className="h-5 w-5" />, color: "#F59E0B" },
        { text: "Space technology and exploration", value: "space_tech", icon: <Rocket className="h-5 w-5" />, color: "#EF4444" }
      ]
    }
  ]

  const careerPaths: CareerPath[] = [
    {
      title: "Data Scientist",
      description: "Transform raw data into actionable insights using statistical analysis and machine learning",
      icon: <Brain className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
      salary: "$95K - $150K",
      growth: "35% faster than average",
      companies: ["Google", "Meta", "Amazon", "Netflix", "Uber"],
      color: "#3B82F6",
      bgColor: "bg-blue-50"
    },
    {
      title: "Full Stack Developer",
      description: "Build complete web applications from frontend to backend with modern technologies",
      icon: <Code className="h-8 w-8" />,
      matchScore: 0,
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS"],
      salary: "$80K - $130K",
      growth: "25% faster than average",
      companies: ["Microsoft", "Apple", "Spotify", "Airbnb", "LinkedIn"],
      color: "#10B981",
      bgColor: "bg-green-50"
    },
    {
      title: "Cybersecurity Engineer",
      description: "Protect systems and networks from digital threats and security breaches",
      icon: <Shield className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Network Security", "Penetration Testing", "Cryptography", "Linux", "Python", "SIEM"],
      salary: "$90K - $140K",
      growth: "40% faster than average",
      companies: ["CrowdStrike", "Palo Alto Networks", "FireEye", "Rapid7", "Splunk"],
      color: "#EF4444",
      bgColor: "bg-red-50"
    },
    {
      title: "Mobile App Developer",
      description: "Create innovative mobile applications for iOS and Android platforms",
      icon: <Smartphone className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Swift", "Kotlin", "React Native", "Flutter", "UI/UX", "APIs"],
      salary: "$75K - $120K",
      growth: "20% faster than average",
      companies: ["Apple", "Google", "Snapchat", "TikTok", "Instagram"],
      color: "#8B5CF6",
      bgColor: "bg-purple-50"
    },
    {
      title: "DevOps Engineer",
      description: "Bridge development and operations with automation and infrastructure management",
      icon: <Rocket className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform", "Linux"],
      salary: "$85K - $135K",
      growth: "30% faster than average",
      companies: ["Netflix", "Amazon", "Google", "Microsoft", "Uber"],
      color: "#F59E0B",
      bgColor: "bg-yellow-50"
    },
    {
      title: "AI/ML Engineer",
      description: "Develop intelligent systems and machine learning models for real-world applications",
      icon: <Brain className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Computer Vision"],
      salary: "$100K - $160K",
      growth: "45% faster than average",
      companies: ["OpenAI", "Google", "Meta", "Tesla", "NVIDIA"],
      color: "#EC4899",
      bgColor: "bg-pink-50"
    },
    // NEW CAREER PATHS
    {
      title: "UX/UI Designer",
      description: "Create intuitive and beautiful user experiences through design thinking and creativity",
      icon: <Palette className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems", "Accessibility"],
      salary: "$70K - $120K",
      growth: "22% faster than average",
      companies: ["Apple", "Google", "Figma", "Adobe", "Airbnb"],
      color: "#EC4899",
      bgColor: "bg-pink-50"
    },
    {
      title: "Game Developer",
      description: "Build immersive gaming experiences using cutting-edge technology and creative storytelling",
      icon: <Gamepad2 className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Unity", "Unreal Engine", "C#", "C++", "3D Modeling", "Game Design"],
      salary: "$65K - $110K",
      growth: "18% faster than average",
      companies: ["Epic Games", "Unity", "EA", "Activision", "Nintendo"],
      color: "#8B5CF6",
      bgColor: "bg-purple-50"
    },
    {
      title: "Quantum Computing Engineer",
      description: "Pioneer the future of computing with quantum algorithms and quantum systems",
      icon: <Cpu className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Quantum Algorithms", "Python", "Linear Algebra", "Quantum Mechanics", "Qiskit", "Research"],
      salary: "$120K - $200K",
      growth: "50% faster than average",
      companies: ["IBM", "Google", "Microsoft", "Rigetti", "IonQ"],
      color: "#06B6D4",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Green Tech Engineer",
      description: "Develop sustainable technology solutions for environmental challenges",
      icon: <Globe className="h-8 w-8" />,
      matchScore: 0,
      skills: ["Renewable Energy", "IoT", "Data Analysis", "Sustainability", "Python", "Hardware"],
      salary: "$75K - $130K",
      growth: "28% faster than average",
      companies: ["Tesla", "SolarCity", "GE Renewable", "Siemens", "Vestas"],
      color: "#10B981",
      bgColor: "bg-green-50"
    }
  ]

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const analyzeAnswers = () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysisResults = careerPaths.map(career => {
        let score = 0
        
        // Calculate match score based on answers
        Object.entries(answers).forEach(([questionId, answer]) => {
          const question = quizQuestions.find(q => q.id === parseInt(questionId))
          if (question) {
            // Enhanced scoring logic for new questions
            if (career.title === "Data Scientist" && 
                (answer === "analytical" || answer === "math" || answer === "ai" || answer === "analytical_learning")) {
              score += 15
            } else if (career.title === "Full Stack Developer" && 
                      (answer === "creative" || answer === "web" || answer === "programming" || answer === "visual")) {
              score += 15
            } else if (career.title === "Cybersecurity Engineer" && 
                      (answer === "security" || answer === "cybersecurity" || answer === "structured" || answer === "infrastructure")) {
              score += 15
            } else if (career.title === "Mobile App Developer" && 
                      (answer === "mobile" || answer === "creative" || answer === "programming" || answer === "media")) {
              score += 15
            } else if (career.title === "DevOps Engineer" && 
                      (answer === "dynamic" || answer === "structured" || answer === "engineering" || answer === "systematic_debugging")) {
              score += 15
            } else if (career.title === "AI/ML Engineer" && 
                      (answer === "ai" || answer === "analytical" || answer === "research" || answer === "ai_advancement")) {
              score += 15
            } else if (career.title === "UX/UI Designer" && 
                      (answer === "visual" || answer === "creative" || answer === "media" || answer === "connectivity")) {
              score += 15
            } else if (career.title === "Game Developer" && 
                      (answer === "gaming" || answer === "creative" || answer === "storytelling" || answer === "vr_ar")) {
              score += 15
            } else if (career.title === "Quantum Computing Engineer" && 
                      (answer === "quantum" || answer === "analytical" || answer === "research" || answer === "ai_advancement")) {
              score += 15
            } else if (career.title === "Green Tech Engineer" && 
                      (answer === "green_tech" || answer === "impact" || answer === "sustainability" || answer === "infrastructure")) {
              score += 15
            }
          }
        })
        
        // Add some randomization for variety
        score += Math.floor(Math.random() * 20)
        
        return { ...career, matchScore: Math.min(100, score) }
      })
      
      // Sort by match score and take top 3
      const topRecommendations = analysisResults
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3)
      
      setCareerRecommendations(topRecommendations)
      setShowResults(true)
      setIsAnalyzing(false)
    }, 3000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setCareerRecommendations([])
    setShowResults(false)
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const currentQuestionData = quizQuestions[currentQuestion]
  const hasAnswered = answers[currentQuestionData?.id]

  if (showResults) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            YOUR CAREER RECOMMENDATIONS
          </h1>
          <p className="text-muted-foreground">
            Based on your answers, here are the top 3 career paths for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careerRecommendations.map((career, index) => (
            <Card key={career.title} className="relative overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div 
                className="absolute top-0 left-0 w-full h-1"
                style={{ backgroundColor: career.color }}
              />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg animate-pulse"
                      style={{ backgroundColor: career.color + '20' }}
                    >
                      <div style={{ color: career.color }}>
                        {career.icon}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{career.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {career.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 animate-bounce">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">Best Match</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {career.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {career.skills.slice(0, 4).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Salary Range</span>
                      <p className="font-medium">{career.salary}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Growth Rate</span>
                      <p className="font-medium text-green-600">{career.growth}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Top Companies</h4>
                    <div className="flex flex-wrap gap-1">
                      {career.companies.slice(0, 3).map((company, companyIndex) => (
                        <Badge key={companyIndex} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={resetQuiz} variant="outline" size="lg" className="hover:scale-105 transition-transform">
            Take Quiz Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '3s' }}
        />
        <div 
          className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '1s', animationDuration: '4s' }}
        />
        <div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '5s' }}
        />
        <div 
          className="absolute bottom-20 right-10 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}
        />
      </div>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            AI CAREER MENTOR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect tech career path, generate elevator pitches, and create AI-powered cover letters
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-purple-200 shadow-lg">
            <div className="flex space-x-1">
              <Button
                variant={activeView === 'quiz' ? 'default' : 'ghost'}
                onClick={() => setActiveView('quiz')}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeView === 'quiz' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Brain className="h-4 w-4 mr-2" />
                Career Quiz
              </Button>
              <Button
                variant={activeView === 'elevator-pitch' ? 'default' : 'ghost'}
                onClick={() => setActiveView('elevator-pitch')}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeView === 'elevator-pitch' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Mic className="h-4 w-4 mr-2" />
                Elevator Pitch
              </Button>
              <Button
                variant={activeView === 'cover-letter' ? 'default' : 'ghost'}
                onClick={() => setActiveView('cover-letter')}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeView === 'cover-letter' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Cover Letter
              </Button>
            </div>
          </div>
        </div>

        {showResults ? (
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                YOUR CAREER RECOMMENDATIONS
              </h1>
              <p className="text-muted-foreground">
                Based on your answers, here are the top 3 career paths for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {careerRecommendations.map((career, index) => (
                <Card key={career.title} className="relative overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div 
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: career.color }}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg animate-pulse"
                          style={{ backgroundColor: career.color + '20' }}
                        >
                          <div style={{ color: career.color }}>
                            {career.icon}
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{career.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {career.matchScore}% Match
                          </Badge>
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="flex items-center gap-1 text-yellow-500 animate-bounce">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">Best Match</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {career.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.slice(0, 4).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Salary Range</span>
                          <p className="font-medium">{career.salary}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Growth Rate</span>
                          <p className="font-medium text-green-600">{career.growth}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Top Companies</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.companies.slice(0, 3).map((company, companyIndex) => (
                            <Badge key={companyIndex} variant="outline" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button onClick={resetQuiz} variant="outline" size="lg" className="hover:scale-105 transition-transform">
                Take Quiz Again
              </Button>
            </div>
          </div>
        ) : activeView === 'quiz' ? (
          <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-white/80 border-2 border-purple-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-purple-800">Question {currentQuestion + 1} of {quizQuestions.length}</CardTitle>
                  <Badge variant="outline" className="text-lg px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300">
                    {Math.round(progress)}% Complete
                  </Badge>
                </div>
                <Progress value={progress} className="w-full h-3 bg-purple-100" />
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {currentQuestionData?.question}
                </h3>
                <p className="text-muted-foreground text-lg">Select the option that best describes you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={answers[currentQuestionData.id] === option.value ? "default" : "outline"}
                    className={`h-auto p-6 justify-start text-left text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      answers[currentQuestionData.id] === option.value 
                        ? 'ring-4 ring-purple-300 shadow-xl' 
                        : 'hover:border-purple-300'
                    }`}
                    onClick={() => handleAnswer(currentQuestionData.id, option.value)}
                    style={{
                      backgroundColor: answers[currentQuestionData.id] === option.value ? option.color : 'transparent',
                      borderColor: option.color,
                      color: answers[currentQuestionData.id] === option.value ? 'white' : option.color
                    }}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-white/20">
                        {option.icon}
                      </div>
                      <span className="text-left">{option.text}</span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-8 py-3 text-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  ← Previous
                </Button>
                
                {currentQuestion === quizQuestions.length - 1 ? (
                  <Button
                    onClick={analyzeAnswers}
                    disabled={!hasAnswered || isAnalyzing}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 min-w-[140px]"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Get Results ✨
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={!hasAnswered}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    Next →
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : activeView === 'elevator-pitch' ? (
          <div className="max-w-4xl mx-auto">
            <ElevatorPitchGenerator />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <CoverLetterGenerator />
          </div>
        )}
      </div>
    </div>
  )
}
