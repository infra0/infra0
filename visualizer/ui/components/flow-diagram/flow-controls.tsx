interface FlowControlsProps {
  onLayoutChange: (direction: "TB" | "LR") => void
}

export default function FlowControls({ onLayoutChange }: FlowControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      <button
        onClick={() => onLayoutChange("TB")}
        className="px-3 py-1 text-xs bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-md text-white hover:bg-gray-700/80 transition-colors"
      >
        Vertical Layout
      </button>
      <button
        onClick={() => onLayoutChange("LR")}
        className="px-3 py-1 text-xs bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-md text-white hover:bg-gray-700/80 transition-colors"
      >
        Horizontal Layout
      </button>
    </div>
  )
} 