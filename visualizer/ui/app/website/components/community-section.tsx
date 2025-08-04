"use client"

import { Button } from "@/components/ui/button"
import { Github, MessageCircle, Star, GitBranch, Users } from "lucide-react"

export default function CommunitySection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Connect with developers, share knowledge, and contribute to the future of infrastructure
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* GitHub Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Github className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">GitHub</h3>
            <p className="text-white/70 mb-6">
              Contribute to our open-source project, report issues, and help shape the future of Infra0
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-1 text-white/60">
                <Star className="w-4 h-4" />
                <span>2.3k</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <GitBranch className="w-4 h-4" />
                <span>180</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <Users className="w-4 h-4" />
                <span>45</span>
              </div>
            </div>
            <Button className="bg-white text-black hover:bg-white/90 font-medium">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>

          {/* Discord Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Discord</h3>
            <p className="text-white/70 mb-6">
              Join our Discord community for real-time discussions, support, and collaboration with fellow developers
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-1 text-white/60">
                <Users className="w-4 h-4" />
                <span>1.2k members</span>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Active now</span>
              </div>
            </div>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-medium">
              <MessageCircle className="w-4 h-4 mr-2" />
              Join Discord
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 