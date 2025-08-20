"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button, ButtonProps } from "@/components/ui/button"
import { Brain, Mail, GraduationCap, Lightbulb, Heart, Eye, X, Rocket } from "lucide-react"
import Link from "next/link"
import { FC, MouseEvent, CSSProperties, ReactNode } from 'react'

interface AboutCreatorPageProps {}

interface CloseButtonProps extends ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface SkillCardProps {
  title: string;
  subtitle: string;
  color: string;
  delay?: string;
}

interface BadgeWithIconProps extends BadgeProps {
  icon: ReactNode;
  text: string;
}

const AboutCreatorPage: FC<AboutCreatorPageProps> = () => {
  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    // Handle close action
  }

  const skillCardStyle = (delay?: string): CSSProperties => ({
    animationDelay: delay || '0s'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Moving Colorful Border Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 animate-border-flow">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-[length:400%_400%] animate-gradient-flow"></div>
        </div>
        <div className="absolute inset-[2px] bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:to-gray-800 rounded-lg"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 shadow-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900 dark:text-white">SRM IST AI Assistant</h1>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Delhi-NCR Campus, Ghaziabad</p>
                </div>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-pulse">
            ABOUT CREATOR
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Meet the brilliant mind behind this AI Campus Assistant
          </p>
        </div>

        {/* Creator Profile Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
            {/* Card Border Animation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 animate-border-flow">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-[length:400%_400%] animate-gradient-flow rounded-lg"></div>
              </div>
              <div className="absolute inset-[2px] bg-white/80 backdrop-blur-sm rounded-lg"></div>
            </div>
            
            <CardContent className="p-6 relative z-10">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold animate-pulse">
                      HB
                    </div>
                    {/* Verification Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Name and Title */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="h-5 w-5 text-red-500 animate-bounce" />
                      <h3 className="text-2xl font-bold text-gray-900">Himanshu_Bali</h3>
                    </div>
                    <p className="text-purple-600 font-medium mb-1">Aspiring Computer Science Engineer</p>
                    <p className="text-gray-700 dark:text-gray-300">Passionate About Technology & Innovation</p>
                    <Lightbulb className="h-4 w-4 text-yellow-500 inline ml-2 animate-pulse" />
                  </div>
                </div>
                
                {/* Close Button */}
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  I am currently pursuing my <strong>Bachelor of Technology (BTech) in Computer Science Engineering</strong>, 
                  with a strong passion for technology and problem-solving. My academic journey is equipping me with a solid 
                  foundation in programming languages like <strong>C++, Java, and Python</strong>, as well as a growing 
                  understanding of data structures, algorithms, and software development.
                </p>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-purple-100 rounded-lg p-3 text-center hover:scale-105 transition-transform duration-300 animate-pulse">
                  <div className="text-2xl font-bold text-purple-600">C++</div>
                  <div className="text-sm text-gray-700">Programming</div>
                </div>
                <div className="bg-green-100 rounded-lg p-3 text-center hover:scale-105 transition-transform duration-300 animate-pulse" style={skillCardStyle('0.2s')}>
                  <div className="text-2xl font-bold text-green-600">Java</div>
                  <div className="text-sm text-gray-700">Development</div>
                </div>
                <div className="bg-purple-100 rounded-lg p-3 text-center hover:scale-105 transition-transform duration-300 animate-pulse" style={skillCardStyle('0.4s')}>
                  <div className="text-2xl font-bold text-purple-600">Python</div>
                  <div className="text-sm text-gray-700">AI & ML</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-3 text-center hover:scale-105 transition-transform duration-300 animate-pulse" style={skillCardStyle('0.6s')}>
                  <div className="text-2xl font-bold text-orange-600">DSA</div>
                  <div className="text-sm text-gray-700">Algorithms</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  BTech CSE Student
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Innovation Enthusiast
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 hover:scale-110 transition-transform duration-300">
                  <Heart className="h-3 w-3 mr-1" />
                  Healthcare Tech
                </Badge>
              </div>

              {/* Contact Section */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-4 w-4 text-gray-600 animate-pulse" />
                  <h4 className="font-medium text-gray-900">Get In Touch</h4>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="text-blue-600 font-medium">himanshuofficialuserid@gmail.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team InnoBotics Message */}
          <div className="text-center mt-8">
            <div className="bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-6 border border-pink-200 dark:border-pink-800 relative overflow-hidden">
              {/* Message Border Animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 animate-border-flow">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 bg-[length:400%_400%] animate-gradient-flow rounded-lg"></div>
                </div>
                <div className="absolute inset-[2px] bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-2 animate-pulse">
                  Made with ❤️ by Team "InnoBotics"
                </h3>
                <p className="text-pink-600 dark:text-pink-400">
                  Innovating the future of campus technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 mt-12 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 SRM Institute of Science and Technology - Delhi-NCR Campus, Ghaziabad</p>
            <p className="mt-1">Powered by Next.js 14, Groq AI & Advanced Analytics</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes border-flow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-border-flow {
          animation: border-flow 8s linear infinite;
        }
        
        .animate-gradient-flow {
          animation: gradient-flow 3s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default AboutCreatorPage
