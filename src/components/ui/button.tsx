
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap text-sm font-light transition-all duration-200 focus-visible:outline-none disabled:opacity-50 uppercase tracking-widest",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-gray-800",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-black bg-transparent hover:bg-black hover:text-white",
        secondary: "text-black hover:text-gray-600 border-b border-transparent hover:border-black",
        ghost: "hover:text-gray-600",
        link: "text-black underline-offset-4 hover:underline font-light",
      },
      size: {
        default: "h-12 px-8 py-4",
        sm: "h-10 px-6 py-3 text-xs",
        lg: "h-14 px-12 py-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
