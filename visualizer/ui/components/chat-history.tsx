"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Trash2, Plus, ChevronLeft } from "lucide-react"
import { IConversation } from "@/services/conversation/conversation.service.types"

interface ChatHistoryProps {
  sessions: IConversation[]
  onSelectSession: (sessionId: string) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function ChatHistory({
  sessions,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}: ChatHistoryProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }
  
  return (
    <div className="w-80 h-full bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 mb-4">
          <ChevronLeft className="w-4 h-4 text-white/60" />
          <h3 className="font-medium text-white/90 text-sm">Chat History</h3>
        </div>
        <Button
          onClick={onNewSession}
          className="w-full bg-white text-black hover:bg-white/90 font-medium text-sm h-9 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session._id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                "hover:bg-white/[0.04] border border-transparent"
              }`}
              onClick={() => onSelectSession(session._id)}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white/90 leading-5 line-clamp-2">
                    {session.title}
                  </h4>
                  <p className="text-xs text-white/50 mt-1">{formatDate(new Date(session.updatedAt))}</p>
                  <p className="text-xs text-white/40 mt-0.5">{session.total_messages_count} messages</p>
                </div>
              </div>

              {/* Delete Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSession(session._id)
                }}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 h-6 w-6 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">No conversations yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}