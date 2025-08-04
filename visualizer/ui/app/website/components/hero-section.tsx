"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Play, ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <Badge className="mb-6 bg-white/10 text-white/90 border-white/20 hover:bg-white/20">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Infrastructure as Code
        </Badge>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Build Infrastructure
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
          Describe your cloud infrastructure in plain English and watch as AI generates 
          production-ready Pulumi code with best practices built-in.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-6 h-auto"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Building
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white/90 hover:bg-white/5 font-semibold px-8 py-6 h-auto"
          >
            <Play className="w-5 h-5 mr-2" />
            Try Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-sm text-white/60">Projects Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-sm text-white/60">Cloud Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-sm text-white/60">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  )
} 