
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-peaceful border border-brand-light-gray bg-white px-3 py-2 text-base shadow-inner-peaceful ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-brand-muted-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black-olive focus-visible:ring-offset-2 focus-visible:shadow-comfortable disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
