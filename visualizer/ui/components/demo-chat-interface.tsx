"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Sparkles } from "lucide-react"
import type { Message } from "ai"
import { ChatRole } from "@/types/chat"
import { InfrastructureResponseParser } from "@/lib/response-parser"
import CompactWorkflow from "@/components/compact-workflow"
import type { Infra0 } from "@/types/infrastructure"

interface DemoChatInterfaceProps {
  messages: Message[]
  isGenerating: boolean
  onDiagramUpdate?: (infra0: Infra0) => void
}

export default function DemoChatInterface({
  messages,
  isGenerating,
  onDiagramUpdate,
}: DemoChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  useEffect(() => {
    // Extract infra0 schema from assistant messages and update diagram
    const lastAssistantMessage = messages
      .filter(m => m.role === ChatRole.ASSISTANT)
      .pop()
    
    if (lastAssistantMessage && onDiagramUpdate) {
      const parsed = InfrastructureResponseParser.parseStreamingResponse(lastAssistantMessage.content)
      if (parsed.sections.infra0Schema) {
        try {
          const infra0 = JSON.parse(parsed.sections.infra0Schema)
          onDiagramUpdate(infra0)
        } catch (error) {
          console.warn('Failed to parse infra0 schema:', error)
        }
      }
    }
  }, [messages, onDiagramUpdate])

  const formatMessage = (message: Message) => {
    if (message.role === ChatRole.ASSISTANT) {
      return InfrastructureResponseParser.getConclusion(message.content)
    }
    return null
  }

  return (
    <div className="h-full flex flex-col bg-white/[0.02] border border-white/[0.08] rounded-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-white/95 text-sm">
              Infrastructure Assistant Demo
            </h3>
            <p className="text-xs text-white/60">
              Watch how AI designs scalable infrastructure
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <ScrollArea
        className="flex-1 p-4 max-h-[calc(100vh-300px)]"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-white/[0.08] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-white/50 text-sm">
                Click "Start Demo" to see the AI assistant in action...
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1
            const isLastMessageGenerating = isGenerating && isLastMessage && message.role === ChatRole.ASSISTANT
            const formattedContent = formatMessage(message)
            const content = formattedContent || message.content
            const hasWorkflowContent = message.content.includes('```introduction') || message.content.includes('```pulumi_code')

            return (
              <div
                key={message.id || index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  message.role === "user" 
                    ? "bg-white text-black" 
                    : "bg-white/[0.04] text-white/95 border border-white/[0.08]"
                }`}>
                  {isLastMessageGenerating && hasWorkflowContent ? (
                    <CompactWorkflow
                      message={message}
                      isWorking={isGenerating}
                    />
                  ) : (
                    <div className="text-sm leading-relaxed">
                      <div className="whitespace-pre-wrap">{content}</div>
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border border-slate-200/60">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Demo Info Footer instead of input */}
      <div className="border-t border-white/[0.08] p-4 flex-shrink-0">
        <div className="text-center">
          <p className="text-xs text-white/50 mb-2">
            🎬 Demo Mode Active
          </p>
          <p className="text-xs text-white/40">
            This is a pre-recorded conversation showcasing infrastructure design capabilities.
            <br />
            The diagram updates automatically as the conversation progresses.
          </p>
        </div>
      </div>
    </div>
  )
} 