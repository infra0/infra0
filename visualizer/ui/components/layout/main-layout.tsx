import React from "react"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className = "" }: MainLayoutProps) {
  return (
    <div className={`h-screen bg-[#0a0a0a] text-white flex overflow-hidden ${className}`}>
      {children}
    </div>
  )
} 