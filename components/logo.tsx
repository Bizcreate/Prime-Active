import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  withText?: boolean
  variant?: "default" | "minimal"
}

export function Logo({ size = "md", withText = true, variant = "default" }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 120, height: 120 },
  }

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative">
        {variant === "default" ? (
          <Image
            src="/prime-mates-logo.png"
            alt="Prime Mates Board Club"
            width={sizes[size].width * 2}
            height={sizes[size].height}
            className="object-contain"
          />
        ) : (
          <svg
            width={sizes[size].width}
            height={sizes[size].height}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0Z"
              fill="#121212"
            />
            <path
              d="M40 10C23.4315 10 10 23.4315 10 40C10 56.5685 23.4315 70 40 70C56.5685 70 70 56.5685 70 40C70 23.4315 56.5685 10 40 10Z"
              stroke="#FFC72D"
              strokeWidth="4"
            />
            <path
              d="M40 20C29.0589 20 20 29.0589 20 40C20 50.9411 29.0589 60 40 60C50.9411 60 60 50.9411 60 40C60 29.0589 50.9411 20 40 20Z"
              fill="#FFC72D"
            />
            <path d="M30 30L50 50M50 30L30 50" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {withText && variant === "minimal" && (
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white">Prime Active</span>
          {size === "lg" && <span className="text-xs text-gray-400">Move & Earn</span>}
        </div>
      )}
    </Link>
  )
}
