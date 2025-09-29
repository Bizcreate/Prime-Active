import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import * as React from "react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === "destructive" ? "border-red-600/30 bg-red-600/10 text-red-300" : "border-zinc-600/30 bg-zinc-800",
        className,
      )}
      {...props}
    />
  ),
)
Alert.displayName = "Alert"

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm [&_a]:underline", className)} {...props} />,
)
AlertDescription.displayName = "AlertDescription"

/* Default icon slot for convenience */
export const AlertIcon = () => <AlertCircle className="absolute left-4 top-4 h-4 w-4" />
