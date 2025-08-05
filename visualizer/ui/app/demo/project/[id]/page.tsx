"use client"

import { useState, useCallback, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { type Infra0Node, type Infra0Edge, Infra0 } from "@/types/infrastructure"
import { ChatRole } from "@/types/chat"
import type { Message } from "ai"

// Import reusable components
import { MainLayout } from "@/components/layout"
import { ProjectHeader } from "@/components/header"
import { ChatPanel } from "@/components/chat"
import { DiagramPanel } from "@/components/diagram"
import PulumiConfigModal from "@/components/pulumi-config-modal"

// Import demo data
import demoData from "@/constants/demo.json"
import { streamDemoResponse } from "@/utils/demo-streaming"

function DemoProjectPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ need_streaming: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const projectId = resolvedParams.id
  const resolvedSearchParams = use(searchParams)
  const needStreaming = resolvedSearchParams.need_streaming === "true"

  // Static demo data
  const [nodes, setNodes] = useState<Infra0Node[]>([])
  const [edges, setEdges] = useState<Infra0Edge[]>([])
  const [resources, setResources] = useState<Record<string, any>>({})

  const [flowDiagram, setFlowDiagram] = useState<Infra0 | null>(null)

  const [selectedNode, setSelectedNode] = useState<Infra0Node | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, Record<string, any>>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectTitle, setProjectTitle] = useState("Demo Project")
  const [input, setInput] = useState()
  const [hasSentMessage, setHasSentMessage] = useState(false)


  const getAssistantResponse = async (path: string): Promise<string> => {
    try {
      const response = await fetch(path)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      console.error('Error fetching assistant response:', error)
      return 'Error loading response'
    }
  }

  const [messages, setMessages] = useState<Message[]>([])
  
  // Load initial messages
  useEffect(() => {
    const loadInitialMessages = async () => {
      const conversation = demoData.conversations.find(conv => conv._id === projectId) || demoData.conversations[0]
      const msg1 = conversation?.messages?.find(msg => msg._id === "msg-1")
      console.log({msg1})
      
      if (msg1) {
        let userMessage = msg1.content;
        if(userMessage.includes('demo_assistant')) {
          userMessage = await getAssistantResponse(userMessage)
        }
        const assistantContent = await getAssistantResponse(msg1.assistant_response_path)
        setMessages([
          {
            id: msg1._id,
            role: "user" as const,
            content: userMessage,
            createdAt: new Date(msg1.createdAt)
          },
          {
            id: `${msg1._id}-assistant`,
            role: "assistant" as const,
            content: assistantContent,
            createdAt: new Date(msg1.createdAt)
          }
        ])
      }
    }
    
    loadInitialMessages()
  }, [projectId])

  useEffect(() => {
    const loadInitialDiagram = async () => {
      try {
        const conversation = demoData.conversations.find(conv => conv._id === projectId) || demoData.conversations[0]
        const msg1 = conversation?.messages?.find(msg => msg._id === "msg-1")
        if (msg1?.assistant_response_path) {
          const responseContent = await getAssistantResponse(msg1.assistant_response_path)
          const infra0Match = responseContent.match(/```infra0_schema\n([\s\S]*?)\n```/)
          
          if (infra0Match) {
            const infra0Data = JSON.parse(infra0Match[1])
            setNodes(infra0Data.diagram.nodes)
            setEdges(infra0Data.diagram.edges)
            setResources(infra0Data.resources || {})
            setFlowDiagram(infra0Data)
          }
        }
      } catch (error) {
        console.error("Error parsing demo infra0 data:", error)
      }
    }
    
    loadInitialDiagram()
  }, [projectId])

  useEffect(() => {
    const conversation = demoData.conversations.find(conv => conv._id === projectId) || demoData.conversations[0]
    setProjectTitle(conversation?.title || "Demo Project")
  }, [projectId])

  const isWorking = isGenerating

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (isGenerating || hasSentMessage) return
      
      setHasSentMessage(true)
      
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content,
        createdAt: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      
      setIsGenerating(true)
      
      let streamedContent = ""
      
      const conversation = demoData.conversations.find(conv => conv._id === projectId) || demoData.conversations[0]
      const followUpMessage = conversation?.messages?.find(msg => msg._id === "follow-up-message-2")
      
      if (!followUpMessage?.assistant_response_path) {
        setIsGenerating(false)
        return
      }
      
      const followUpResponse = await getAssistantResponse(followUpMessage.assistant_response_path)
      
      const cancelStream = streamDemoResponse(
        followUpResponse,
        (chunk) => {
          streamedContent += chunk
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = streamedContent
            } else {
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
          setIsGenerating(false)
          
          try {
            const responseContent = followUpResponse
            const infra0Match = responseContent.match(/```infra0_schema\n([\s\S]*?)\n```/)
            
            if (infra0Match) {
              const infra0Data = JSON.parse(infra0Match[1])
              setNodes(infra0Data.diagram.nodes)
              setEdges(infra0Data.diagram.edges)
              setResources(infra0Data.resources || {})
              setFlowDiagram(infra0Data)
            }
          } catch (error) {
            console.error("Error parsing follow-up infra0 data:", error)
          }
        },
        8000
      )
    },
    [isGenerating, hasSentMessage, projectId],
  )

  const updateDiagram = (message_id: string) => {
    console.log("Demo: Would update diagram for message:", message_id)
  }

  const handleNodeUpdate = (nodeId: string, updatedNode: Infra0Node) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === nodeId ? updatedNode : node)))

    if (nodeId !== updatedNode.id) {
      setEdges((prevEdges) =>
        prevEdges.map((edge) => ({
          ...edge,
          from: edge.from === nodeId ? updatedNode.id : edge.from,
          to: edge.to === nodeId ? updatedNode.id : edge.to,
        })),
      )
    }
  }

  // For DiagramState component - still needed for configuration
  const handleNodeClick = (node: Infra0Node) => {
    setSelectedNode(node)
    setIsConfigModalOpen(true)
  }

  const handleConfigSave = (nodeId: string, config: Record<string, any>) => {
    console.log("Demo: Would save config for node:", nodeId, config)
  }

  const handleCloseConfigModal = () => {
    setIsConfigModalOpen(false)
    setSelectedNode(null)
  }

  // Keep for FullscreenDiagram compatibility
  const handleNodesChange = (updatedNodes: Infra0Node[]) => {
    setNodes(updatedNodes)
  }

  return (
    <MainLayout className="flex flex-col">
              <ProjectHeader
          projectTitle={projectTitle}
          projectId={projectId}
        >
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <span className="text-xs font-medium text-blue-400">Demo Mode</span>
            </div>
          </div>
        </ProjectHeader>

        <div className="flex flex-1 overflow-hidden">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isGenerating={isWorking}
            updateDiagram={updateDiagram}
            className="w-1/2"
            initialInput={input}
            readOnly={hasSentMessage}
            demoMode={true}
          />

          <DiagramPanel
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            onNodeUpdate={handleNodeUpdate}
            className="w-1/2"
          />
        </div>

        <PulumiConfigModal
          node={selectedNode}
          resources={resources}
          isOpen={isConfigModalOpen}
          onClose={handleCloseConfigModal}
          onSave={handleConfigSave}
        />
    </MainLayout>
  )
}

export default DemoProjectPage 