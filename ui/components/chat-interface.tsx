"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUp, Sparkles, User, Bot, Loader2 } from "lucide-react"
import CompactWorkflow from "./compact-workflow"
import type { ChatMessage } from "../types/chat"

interface ChatInterfaceProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isGenerating: boolean
}

export default function ChatInterface({ messages, onSendMessage, isGenerating }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isGenerating])

  const handleSend = () => {
    if (!input.trim() || isGenerating) return
    onSendMessage(input.trim())
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
            <h3 className="font-semibold text-white/95 text-sm">Infrastructure Assistant</h3>
            <p className="text-xs text-white/60">Continue the conversation about your infrastructure</p>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-white/[0.08] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-white/50 text-sm">Continue building your infrastructure...</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "assistant" && (
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-black" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-white text-black"
                    : "bg-white/[0.04] text-white/95 border border-white/[0.08]"
                }`}
              >
                {message.type === "assistant" && message.isStreaming ? (
                  <CompactWorkflow prompt={message.content} />
                ) : (
                  <>
                    <div className="text-sm leading-relaxed">
                      {message.content}
                      {message.isStreaming && <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />}
                    </div>
                    <div className={`text-xs mt-2 ${message.type === "user" ? "text-black/60" : "text-white/50"}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </>
                )}
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-white/[0.12] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-white/80" />
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Loader2 className="w-4 h-4 text-black animate-spin" />
              </div>
              <div className="bg-white/[0.04] text-white/95 border border-white/[0.08] rounded-xl px-4 py-3 max-w-[85%]">
                <CompactWorkflow prompt="Updating infrastructure..." />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Fixed Input at Bottom */}
      <div className="border-t border-white/[0.08] p-4 flex-shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask v0 to build..."
              className="min-h-[50px] max-h-[100px] bg-white/[0.04] border-white/[0.12] text-white/95 placeholder:text-white/40 resize-none text-sm leading-relaxed focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.1] rounded-lg pr-12"
              disabled={isGenerating}
            />
            <div className="absolute bottom-2 right-2">
              <Button
                onClick={handleSend}
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
  )
}
