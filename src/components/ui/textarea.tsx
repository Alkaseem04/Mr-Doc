import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Custom property to control textarea sizing
  textareaSize?: "sm" | "md" | "lg"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, textareaSize = "md", ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          textareaSize === "sm" && "min-h-[60px] py-1 text-xs",
          textareaSize === "md" && "min-h-[80px] py-2 text-sm",
          textareaSize === "lg" && "min-h-[120px] py-3 text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }