interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
}

export function CircularProgress({
  value,
  size = 40,
  strokeWidth = 4,
  color = "#FFC72D",
  bgColor = "#27272A",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {/* Optional: Add text in the center */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium">{value}%</span>
      </div> */}
    </div>
  )
}
