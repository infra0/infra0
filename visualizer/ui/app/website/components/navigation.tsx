"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function Navigation() {
  return (
    <nav className="border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Infra0</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">
              Features
            </a>
            <a href="#capabilities" className="text-white/70 hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#community" className="text-white/70 hover:text-white transition-colors">
              Community
            </a>
            <a href="#faq" className="text-white/70 hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Docs
            </a>
          </div>

          <div className="flex items-center">
            <Button className="bg-white text-black hover:bg-white/90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 