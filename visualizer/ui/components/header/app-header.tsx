import React from "react"
import { Sparkles } from "lucide-react"

interface AppHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function AppHeader({ title, subtitle, children }: AppHeaderProps) {
  return (
    <div className="border-b border-white/[0.08] px-8 py-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white/95">{title}</h1>
            {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
} 