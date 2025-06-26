interface MapMarkerProps {
  type: "skatepark" | "trail" | "surf" | "user" | "checkpoint" | "spot"
  size?: "sm" | "md" | "lg"
  active?: boolean
}

export function MapMarker({ type, size = "md", active = false }: MapMarkerProps) {
  const colors = {
    skatepark: "#ffc72d",
    trail: "#4ade80",
    surf: "#60a5fa",
    user: "#f43f5e",
    checkpoint: "#a855f7",
    spot: "#ffc72d",
  }

  const sizes = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  const pulseSize = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className="relative">
      <div className={`rounded-full ${sizes[size]}`} style={{ backgroundColor: colors[type] }} />
      {active && (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${pulseSize[size]} animate-pulse opacity-50`}
          style={{ backgroundColor: colors[type] }}
        />
      )}
    </div>
  )
}
