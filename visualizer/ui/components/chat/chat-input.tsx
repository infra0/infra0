import React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ArrowUp } from "lucide-react"

interface ChatInputProps {
  input: string
  onInputChange?: (value: string) => void
  onSendMessage: () => void
  onNewSession?: () => void
  isWorking?: boolean
  placeholder?: string
  showNewProjectButton?: boolean
  readOnly?: boolean
  demoMode?: boolean
  demoMessage?: string
}

export function ChatInput({
  input,
  onInputChange,
  onSendMessage,
  onNewSession,
  isWorking = false,
  placeholder = "Ask infrastructure assistant to build...",
  showNewProjectButton = true,
  readOnly = false,
  demoMode = false,
  demoMessage = "Demo Mode - Click \"Send\" or any example to see the project view",
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !readOnly) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <div className="border-t border-white/[0.08] p-6 flex-shrink-0 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          {showNewProjectButton && onNewSession && (
            <Button
              onClick={onNewSession}
              variant="outline"
              className="border-white/[0.12] text-white/70 hover:bg-white/[0.04] hover:text-white/90 bg-transparent font-medium text-sm h-10 px-4"
              disabled={isWorking}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          )}
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              readOnly={readOnly}
              className={`min-h-[60px] max-h-[120px] bg-white/[0.04] border-white/[0.12] text-white/95 placeholder:text-white/40 resize-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.1] rounded-xl text-sm leading-relaxed pr-12 ${
                readOnly ? 'cursor-not-allowed opacity-80' : ''
              }`}
              disabled={isWorking}
            />
            <div className="absolute bottom-3 right-3">
              <Button
                onClick={onSendMessage}
                disabled={!input.trim() || isWorking}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-50 h-8 w-8 p-0 rounded-lg"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        {demoMode && (
          <div className="mt-2 text-xs text-white/40 text-center">
            {demoMessage}
          </div>
        )}
      </div>
    </div>
  )
} 