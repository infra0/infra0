"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Sparkles, ArrowUp } from "lucide-react"
import ChatHistory from "@/components/chat-history"
import StreamingWorkflow from "@/components/streaming-workflow"
import type { ChatSession } from "@/types/chat"
import { generateId } from "@/lib/utils"

// Sample sessions
const sampleSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "AWS VPC with ECS and RDS",
    messages: [],
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: "session-2",
    title: "GCP Kubernetes Cluster",
    messages: [],
    nodes: [],
    edges: [],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 7200000),
  },
]

export default function HomePage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>(sampleSessions)
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleNewSession = useCallback(() => {
    const sessionId = generateId()
    const newSession: ChatSession = {
      id: sessionId,
      title: "New Infrastructure Project",
      messages: [],
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setSessions((prev) => [newSession, ...prev])
    router.push(`/project/${sessionId}`)
  }, [router])

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)

    // Create new project after workflow completes
    setTimeout(() => {
      const sessionId = generateId()
      const newSession: ChatSession = {
        id: sessionId,
        title: input.length > 30 ? input.substring(0, 30) + "..." : input,
        messages: [],
        nodes: [],
        edges: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setSessions((prev) => [newSession, ...prev])
      setIsGenerating(false)
      router.push(`/project/${sessionId}?prompt=${encodeURIComponent(input)}`)
    }, 8000) // Wait for workflow to complete
  }, [input, isGenerating, router])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      router.push(`/project/${sessionId}`)
    },
    [router],
  )

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }, [])

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      {/* Chat History Sidebar - Full Height */}
      <div className="w-80 h-full">
        <ChatHistory
          sessions={sessions}
          currentSessionId={null}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-white/[0.08] px-8 py-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white/95">Cursor for Infrastructure</h1>
              <p className="text-sm text-white/60">Generate Pulumi infrastructure code with AI</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <div className="min-h-full flex flex-col">
            {isGenerating ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <StreamingWorkflow prompt={input} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-2xl w-full text-center">
                  {/* Welcome Section */}
                  <div className="mb-12">
                    <h2 className="text-4xl font-semibold text-white/95 mb-4 tracking-tight">
                      What can I help you build?
                    </h2>
                    <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
                      Describe your infrastructure needs and I'll generate a complete infrastructure diagram with Pulumi
                      code.
                    </p>
                  </div>

                  {/* Example Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
                    <div
                      className="p-4 border border-white/[0.08] rounded-xl bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 text-left"
                      onClick={() => {
                        setInput(
                          "Create an AWS VPC with public and private subnets, an RDS database, and an ECS cluster",
                        )
                      }}
                    >
                      <h3 className="font-medium text-white/90 mb-2 text-sm">AWS Web Application</h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        "Create an AWS VPC with public and private subnets, an RDS database, and an ECS cluster"
                      </p>
                    </div>
                    <div
                      className="p-4 border border-white/[0.08] rounded-xl bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 text-left"
                      onClick={() => {
                        setInput("Set up a GCP Kubernetes cluster with Cloud SQL and Cloud Storage")
                      }}
                    >
                      <h3 className="font-medium text-white/90 mb-2 text-sm">GCP Kubernetes Setup</h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        "Set up a GCP Kubernetes cluster with Cloud SQL and Cloud Storage"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Fixed Input Section at Bottom */}
        <div className="border-t border-white/[0.08] p-6 flex-shrink-0 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Button
                onClick={handleNewSession}
                variant="outline"
                className="border-white/[0.12] text-white/70 hover:bg-white/[0.04] hover:text-white/90 bg-transparent font-medium text-sm h-10 px-4"
                disabled={isGenerating}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask v0 to build..."
                  className="min-h-[60px] max-h-[120px] bg-white/[0.04] border-white/[0.12] text-white/95 placeholder:text-white/40 resize-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.1] rounded-xl text-sm leading-relaxed pr-12"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-3 right-3">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isGenerating}
                    className="bg-white text-black hover:bg-white/90 disabled:opacity-50 h-8 w-8 p-0 rounded-lg"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
