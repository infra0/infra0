"use client"

import type React from "react"
import type { Message } from "ai"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChatRole } from "@/types/chat"
import { IConversation } from "@/services/conversation/conversation.service.types"

// Import reusable components
import { MainLayout, SidebarLayout } from "@/components/layout"
import { AppHeader } from "@/components/header"
import { ChatMessages, ChatInput } from "@/components/chat"

// Import demo data and utilities
import demoData from "@/constants/demo.json"
import { streamDemoResponse } from "@/utils/demo-streaming"

function DemoHomePage() {
  const router = useRouter()
  
  // Convert demo data to proper types
  const conversations: IConversation[] = demoData.conversations.map(conv => ({
    _id: conv._id,
    title: conv.title,
    total_messages_count: conv.total_messages_count,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt
  }))
  
  const prefilledPrompt = demoData.prefilledPrompt
  const prefilledResponse = demoData.prefilledResponse
  
  // State for messages and streaming
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [input] = useState(prefilledPrompt)
  
  // Ref to store the cancel function
  const cancelStreamRef = useRef<(() => void) | null>(null)
  
  // Combined working state (like in main page)
  const isWorking = isSubmitting || isStreaming

  const handleNewSession = useCallback(() => {
    // Demo: Navigate to a demo project
    router.push("/demo/project/demo-conv-1")
  }, [router])

  const handleSendMessage = useCallback(() => {
    if (isWorking) return // Prevent multiple streams
    
    // Set submitting state to show loader
    setIsSubmitting(true)
    
    // Add user message instantly
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Start streaming assistant response
    setIsStreaming(true)
    
    let streamedContent = ""
    
    const cancelStream = streamDemoResponse(
      prefilledResponse,
      (chunk) => {
        streamedContent += chunk
        // Update the assistant message with streamed content
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = streamedContent
          } else {
            // Create new assistant message if it doesn't exist
            newMessages.push({
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: streamedContent,
              createdAt: new Date()
            })
          }
          
          return newMessages
        })
      },
      () => {
        // Streaming completed
        setIsStreaming(false)
        setIsSubmitting(false)
        cancelStreamRef.current = null
        
        // Add the conversation to sidebar (in a real app, this would be an API call)
        console.log("Demo: Conversation completed and would be added to sidebar")
      },
      10000 // 10 seconds
    )
    
    cancelStreamRef.current = cancelStream
  }, [input, prefilledResponse, isStreaming])

  const handleExampleClick = useCallback((example: string) => {
    // Demo: Navigate to a demo project when example is clicked
    router.push("/demo/project/demo-conv-1")
  }, [router])

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      router.push(`/demo/project/${sessionId}`)
    },
    [router],
  )

  const handleDeleteSession = useCallback((sessionId: string) => {
    // Demo: No actual deletion, just log
    console.log("Demo: Would delete session", sessionId)
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
          title="Cursor for Infrastructure - Demo"
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
          onSendMessage={handleSendMessage}
          onNewSession={handleNewSession}
          isWorking={isWorking}
          showNewProjectButton={true}
          readOnly={true}
          demoMode={true}
        />
      </SidebarLayout>
    </MainLayout>
  )
}

export default DemoHomePage 