import React from "react"
import ChatHistory from "@/components/chat-history"
import { IConversation } from "@/services/conversation/conversation.service.types"

interface SidebarLayoutProps {
  children: React.ReactNode
  conversations: IConversation[]
  onSelectSession: (sessionId: string) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function SidebarLayout({
  children,
  conversations,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isCollapsed = false,
  onToggleCollapse = () => {},
}: SidebarLayoutProps) {
  return (
    <>
      {/* Chat History Sidebar - Full Height */}
      <div className="w-80 h-full">
        <ChatHistory
          sessions={conversations}
          onSelectSession={onSelectSession}
          onNewSession={onNewSession}
          onDeleteSession={onDeleteSession}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {children}
      </div>
    </>
  )
} 