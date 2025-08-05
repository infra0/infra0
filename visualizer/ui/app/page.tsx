"use client"

import type React from "react"
import type { Message } from "ai"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatRole } from "@/types/chat"
import { useChat } from "@/hooks/use-chat"
import { IConversation } from "@/services/conversation/conversation.service.types"
import { createConversation, getConversations } from "@/services/conversation/conversation.service"
import { toast } from "@/components/ui/use-toast"

// Import reusable components
import { MainLayout, SidebarLayout } from "@/components/layout"
import { AppHeader } from "@/components/header"
import { ChatMessages, ChatInput } from "@/components/chat"

function HomePage() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const { isWorking : isLLMStreaming, append, messages, setCurrentConversationId, latestMessageIdToRender } = useChat('user-chat-id')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [conversations, setConversations] = useState<IConversation[]>([])

  const isWorking = isSubmitting || isLLMStreaming;

  useEffect(() => {
    try {
      const fetchConversations = async () => {
        const { data } = await getConversations()
        setConversations(data.conversations)
      }
      fetchConversations()
    } catch (error) {
      toast({
        title: 'Error fetching conversations',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  }, [])

  useEffect(() => {
    if(latestMessageIdToRender) {
      router.push(`/project/${latestMessageIdToRender}`)
    }
  },[])

  const handleNewSession = useCallback(() => {
    // TODO call api and create a new conversation
    // setSessions((prev) => [newSession, ...prev])
    // router.push(`/project/${sessionId}`)
  }, [])

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isWorking || isSubmitting) return
    setIsSubmitting(true);

    const message = {
      role: ChatRole.USER,
      content: input,
    }

    const { data } = await createConversation({
      prompt: input,
    })
    setCurrentConversationId(data._id)
    setConversations((prev) => [data, ...prev])

    append(message)

    setInput("")
    setIsSubmitting(false)
  }, [input, isWorking, append])

  const handleExampleClick = useCallback((example: string) => {
    setInput(example)
  }, [])

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      router.push(`/project/${sessionId}`)
    },
    [router],
  )

  const handleDeleteSession = useCallback((sessionId: string) => {
    // TODO call api and delete that project
    // setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }, [])

  return (
    <MainLayout>
      <SidebarLayout
        conversations={conversations}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        isCollapsed={false}
        onToggleCollapse={() => {}}
      >
        {/* Header */}
        <AppHeader
          title="Cursor for Infrastructure"
          subtitle="Generate Pulumi infrastructure code with AI"
        />

        {/* Chat Messages */}
        <ChatMessages
          messages={messages}
          isWorking={isWorking}
          onExampleClick={handleExampleClick}
        />

        {/* Chat Input */}
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSendMessage={handleSendMessage}
          onNewSession={handleNewSession}
          isWorking={isWorking}
          showNewProjectButton={true}
          readOnly={false}
          demoMode={false}
        />
      </SidebarLayout>
    </MainLayout>
  )
}

export default HomePage
