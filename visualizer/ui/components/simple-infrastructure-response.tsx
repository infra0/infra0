"use client"

import { useState, useEffect, useMemo } from "react"
import { Sparkles, Loader2, CheckCircle } from "lucide-react"
import { InfrastructureResponseParser } from "@/lib/response-parser"
import type { ParsedResponseState, WorkflowStep } from "@/types/infrastructure"

interface SimpleInfrastructureResponseProps {
  content: string
  isStreaming?: boolean
}

export default function SimpleInfrastructureResponse({ 
  content, 
  isStreaming = false 
}: SimpleInfrastructureResponseProps) {
  const [parsedState, setParsedState] = useState<ParsedResponseState>({
    currentSection: null,
    sections: {}
  })

  // Parse the content whenever it changes
  useEffect(() => {
    const newState = InfrastructureResponseParser.parseStreamingResponse(content)
    setParsedState(newState)
  }, [content])

  const { sections } = parsedState
  const isGeneratingCode = isStreaming && !sections.outro && sections.pulumiCode


  const getGeneratingMessage = () => {
    if (isGeneratingCode && sections.infra0Schema) {
      return "Generating infrastructure diagram..."
    }
    return "Generating code..."
  }

  return (
    <div className="space-y-6">
      {/* Introduction Section */}
      {sections.intro && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-white/90 mb-2">Getting Started</h3>
              <p className="text-white/75 leading-relaxed">{sections.intro}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generating Code Section - Only show when actively generating code */}
      {isGeneratingCode && (
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 flex items-center justify-center min-h-[100px]">
          <div className="flex items-center gap-3 text-white/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{getGeneratingMessage()}</span>
          </div>
        </div>
      )}

    {sections.outro && (
        <div className="bg-green-500/[0.05] border border-green-500/[0.2] rounded-xl p-6 flex items-center justify-center min-h-[100px]">
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Infrastructure generated successfully</span>
          </div>
        </div>
      )}

      {/* Outro Section */}
      {sections.outro && (
        <div className="p-4 rounded-xl bg-green-500/[0.05] border border-green-500/[0.2]">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-green-400 mb-2">Ready to Deploy</h3>
              <p className="text-white/75 leading-relaxed">{sections.outro}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 