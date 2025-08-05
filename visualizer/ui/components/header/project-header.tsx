import React from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectHeaderProps {
  projectTitle: string
  projectId: string
  children?: React.ReactNode
}

export function ProjectHeader({ projectTitle, projectId, children }: ProjectHeaderProps) {
  const router = useRouter()

  return (
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
        {children}
      </div>
    </div>
  )
} 