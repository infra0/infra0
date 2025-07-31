"use client"

import { useState, useCallback, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft, Settings, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatInterface from "@/components/chat-interface"
import DiagramState from "@/components/diagram-state"
import FlowDiagram from "@/components/flow-diagram"
import FullscreenDiagram from "@/components/fullscreen-diagram"
import PulumiConfigModal from "@/components/pulumi-config-modal"
import { type Infra0Node, type Infra0Edge, Infra0EdgeType, Infra0 } from "@/types/infrastructure"
import { ChatRole } from "@/types/chat"
import { getAllMessages } from "@/services/conversation/conversation.service"
import { useChat } from "@/hooks/use-chat"
import { useRef } from "react"


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
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/[0.08] bg-[#0a0a0a] px-8 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-white/60 hover:text-white/90 hover:bg-white/[0.04] -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white/95">{projectTitle}</h1>
              <p className="text-sm text-white/50 mt-0.5">Project ID: {projectId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Full Height Chat */}
        <div className="w-1/2 border-r border-white/[0.08] flex flex-col bg-[#0a0a0a]">
          <div className="flex-1 p-6">
            <ChatInterface updateDiagram={updateDiagram} messages={messages} onSendMessage={handleSendMessage} isGenerating={isWorking} />
          </div>
        </div>

        {/* Right Panel - Infrastructure Diagram with Tabs */}
        <div className="w-1/2 flex flex-col bg-[#0a0a0a]">
          <div className="p-6 border-b border-white/[0.08] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                  <h2 className="text-lg font-semibold text-white/95">Infrastructure Diagram</h2>
                </div>
                <p className="text-sm text-white/60">
                  Interactive flow diagram - click nodes to select, hover to highlight connections
                </p>
              </div>
              <FullscreenDiagram
                nodes={nodes}
                edges={edges}
                onNodeClick={handleNodeClick}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="diagram" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-white/[0.04] border-b border-white/[0.08]">
                <TabsTrigger
                  value="diagram"
                  className="flex items-center gap-2 text-white/70 data-[state=active]:text-white/95"
                >
                  <Eye className="w-4 h-4" />
                  Diagram
                </TabsTrigger>
                <TabsTrigger
                  value="state"
                  className="flex items-center gap-2 text-white/70 data-[state=active]:text-white/95"
                >
                  <Settings className="w-4 h-4" />
                  State
                </TabsTrigger>
              </TabsList>
              <TabsContent value="diagram" className="flex-1 p-6 mt-0">
                <FlowDiagram
                  nodes={nodes}
                  edges={edges}
                  onNodeClick={handleNodeClick}
                />
              </TabsContent>
              <TabsContent value="state" className="flex-1 p-6 mt-0">
                <DiagramState
                  nodes={nodes}
                  edges={edges}
                  onNodeUpdate={handleNodeUpdate}
                  onNodeClick={handleNodeClick}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Pulumi Config Modal */}
      <PulumiConfigModal
        node={selectedNode}
        resources={resources}
        isOpen={isConfigModalOpen}
        onClose={handleCloseConfigModal}
        onSave={handleConfigSave}
      />
    </div>
  )
}
export default ProjectPage;
