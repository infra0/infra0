"use client"

import { useState, useCallback, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { type Infra0Node, type Infra0Edge, Infra0 } from "@/types/infrastructure"
import { ChatRole } from "@/types/chat"
import { getAllMessages } from "@/services/conversation/conversation.service"
import { useChat } from "@/hooks/use-chat"
import { useRef } from "react"

// Import reusable components
import { MainLayout } from "@/components/layout"
import { ProjectHeader } from "@/components/header"
import { ChatPanel } from "@/components/chat"
import { DiagramPanel } from "@/components/diagram"
import PulumiConfigModal from "@/components/pulumi-config-modal"

function ProjectPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ need_streaming: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const projectId = resolvedParams.id
  const resolvedSearchParams = use(searchParams)
  const needStreaming = resolvedSearchParams.need_streaming === "true"

  const { messages, isWorking: isLLMStreaming, reload, append, setMessages, setMessagesToInfra0Map, messagesToInfra0Map, latestMessageIdToRender, setLatestMessageIdToRender } = useChat(projectId)

  const [nodes, setNodes] = useState<Infra0Node[]>([])
  const [edges, setEdges] = useState<Infra0Edge[]>([])
  const [resources, setResources] = useState<Record<string, any>>({})

  const [flowDiagram, setFlowDiagram] = useState<Infra0 | null>(null)

  const [selectedNode, setSelectedNode] = useState<Infra0Node | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, Record<string, any>>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectTitle, setProjectTitle] = useState("Loading project...")

  const isWorking = isLLMStreaming || isGenerating;

  const hasInitialStreamingCheckRef = useRef(false)

  useEffect(() => {
    if(latestMessageIdToRender) {
      const infra0 = messagesToInfra0Map[latestMessageIdToRender]
      if(infra0) {
        setNodes(infra0.diagram.nodes)
        setEdges(infra0.diagram.edges)
        setResources(infra0.resources || {})
      }
    }
  }, [latestMessageIdToRender])

  useEffect(() => {
    try {   
      const fetchMessages = async () => {
        const { data } = await getAllMessages({ conversation_id: projectId })
        setProjectTitle(data.title)

        const aiMessagesToFeed = data.messages.map((message) => {
          return {
            id: message._id,
            role: message.role,
            content: message.content,
            createdAt: new Date(message.createdAt),
          }
        })

        setMessages(aiMessagesToFeed)

        data.messages.forEach((message) => {
          if(message.role === ChatRole.ASSISTANT) {
            const infra0 = message.infra0
                      
          if(infra0) {
            console.log({infra0})
            setNodes(infra0.diagram.nodes)
            setEdges(infra0.diagram.edges)
            setResources(infra0.resources || {})
          }
          }
        })


        const messagesToInfra0Map = data.messages.reduce((acc, message) => {
          if(message.infra0) {
            acc[message._id] = message.infra0
          }
          return acc
        }, {} as Record<string, Infra0>)

        setMessagesToInfra0Map(messagesToInfra0Map)

      }
  
      fetchMessages()
    } catch(err) {
      console.log({ err })
    }
  }, [projectId])

  useEffect(() => {
    if (hasInitialStreamingCheckRef.current) return
    
    const lastMessageRole = messages[messages.length - 1]?.role    
    if (needStreaming && lastMessageRole === ChatRole.USER) {
      reload()
      hasInitialStreamingCheckRef.current = true
      // remove need_streaming param from search param
      router.replace(`/project/${projectId}`)
    }
  }, [messages, needStreaming, reload])


  const handleSendMessage = useCallback(
    (content: string) => {
      setIsGenerating(true)

      append({
        role: ChatRole.USER,
        content,
      }, {
        body: {
          conversation_id: projectId,
        },
      })

     setIsGenerating(false);
    },
    [append],
  )

  const updateDiagram = (message_id : string) => {
    const infra0 = messagesToInfra0Map[message_id]
    if(infra0) {
      setNodes(infra0.diagram.nodes)
      setEdges(infra0.diagram.edges)
      setResources(infra0.resources || {})
    } else {
      if(latestMessageIdToRender) { // HACK - remove in future
        const infra0 = messagesToInfra0Map[latestMessageIdToRender]
        if(infra0) {
          setNodes(infra0.diagram.nodes)
          setEdges(infra0.diagram.edges)
          setResources(infra0.resources || {})
        }
      }
    }
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
    // TODO
    // setNodeConfigs((prev) => ({
    //   ...prev,
    //   [nodeId]: config,
    // }))
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
      {/* Header */}
      <ProjectHeader
        projectTitle={projectTitle}
        projectId={projectId}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Full Height Chat */}
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isWorking}
          updateDiagram={updateDiagram}
          className="w-1/2"
        />

        {/* Right Panel - Infrastructure Diagram with Tabs */}
        <DiagramPanel
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onNodeUpdate={handleNodeUpdate}
          className="w-1/2"
        />
      </div>

      {/* Pulumi Config Modal */}
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

export default ProjectPage;
