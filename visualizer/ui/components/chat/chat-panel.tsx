import React from "react"
import ChatInterface from "@/components/chat-interface"

interface ChatPanelProps {
  messages: any[]
  onSendMessage: (content: string) => void
  isGenerating: boolean
  updateDiagram: (messageId: string) => void
  className?: string
  initialInput?: string
  readOnly?: boolean
  demoMode?: boolean
}

export function ChatPanel({
  messages,
  onSendMessage,
  isGenerating,
  updateDiagram,
  className = "",
  initialInput = "",
  readOnly = false,
  demoMode = false,
}: ChatPanelProps) {
  return (
    <div className={`border-r border-white/[0.08] flex flex-col bg-[#0a0a0a] ${className}`}>
      <div className="flex-1 p-6">
        <ChatInterface 
          updateDiagram={updateDiagram} 
          messages={messages} 
          onSendMessage={onSendMessage} 
          isGenerating={isGenerating}
          initialInput={initialInput}
          readOnly={readOnly}
          demoMode={demoMode}
        />
      </div>
    </div>
  )
} 