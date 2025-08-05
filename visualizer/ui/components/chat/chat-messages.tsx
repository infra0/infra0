import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { Message } from "ai"
import { ChatRole } from "@/types/chat"
import SimpleInfrastructureResponse from "@/components/simple-infrastructure-response"

interface ChatMessagesProps {
  messages: Message[]
  isWorking?: boolean
  className?: string
  onExampleClick?: (example: string) => void
}

export function ChatMessages({ 
  messages, 
  isWorking = false, 
  className = "",
  onExampleClick,
}: ChatMessagesProps) {
  const handleExampleClick = (example: string) => {
    if (onExampleClick) {
      onExampleClick(example)
    }
  }

  return (
    <ScrollArea className={`flex-1 ${className}`}>
      <div className="min-h-full flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full text-center">
              {/* Welcome Section */}
              <div className="mb-12">
                <h2 className="text-4xl font-semibold text-white/95 mb-4 tracking-tight">
                  What can I help you build?
                </h2>
                <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
                  Describe your infrastructure needs and I'll generate a complete infrastructure diagram with Pulumi
                  code.
                </p>
              </div>

              {/* Example Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
                <div
                  className="p-4 border border-white/[0.08] rounded-xl bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 text-left"
                  onClick={() => handleExampleClick("Create an AWS VPC with public and private subnets, an RDS database, and an ECS cluster")}
                >
                  <h3 className="font-medium text-white/90 mb-2 text-sm">AWS Web Application</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    "Create an AWS VPC with public and private subnets, an RDS database, and an ECS cluster"
                  </p>
                </div>
                <div
                  className="p-4 border border-white/[0.08] rounded-xl bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 text-left"
                  onClick={() => handleExampleClick("Set up a GCP Kubernetes cluster with Cloud SQL and Cloud Storage")}
                >
                  <h3 className="font-medium text-white/90 mb-2 text-sm">GCP Kubernetes Setup</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    "Set up a GCP Kubernetes cluster with Cloud SQL and Cloud Storage"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message: Message, index: number) => {
                if (isWorking && index === messages.length - 1 && message.role === 'assistant') {
                  return null
                }
                
                return (
                  <div
                    key={index}
                    className={`flex ${message.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === ChatRole.USER ? (
                      <div className="max-w-[80%] rounded-xl p-4 bg-white text-black ml-4">
                        <div className="text-sm font-medium mb-2 opacity-60">You</div>
                        <div className="prose prose-sm max-w-none">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-[95%] mr-4">
                        <div className="text-sm font-medium mb-3 text-white/60">Assistant</div>
                        <SimpleInfrastructureResponse 
                          content={message.content} 
                          isStreaming={false}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
              {isWorking && (
                <div className="flex justify-start">
                  <div className="max-w-[95%] mr-4">
                    <div className="text-sm font-medium mb-3 text-white/60">Assistant</div>
                    {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' ? (
                      <SimpleInfrastructureResponse 
                        content={messages[messages.length - 1].content} 
                        isStreaming={true}
                      />
                    ) : (
                      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm opacity-60">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
} 