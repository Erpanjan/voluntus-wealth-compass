
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-comfortable text-sm font-medium font-body transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand-black-olive text-white hover:bg-opacity-90 shadow-gentle hover:shadow-comfortable",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-brand-light-gray bg-background hover:bg-brand-almond hover:text-brand-black-olive shadow-gentle",
        secondary:
          "bg-brand-almond text-brand-black-olive hover:bg-brand-light-gray shadow-gentle hover:shadow-peaceful",
        ghost: "hover:bg-brand-almond hover:text-brand-black-olive",
        link: "text-brand-muted-gray underline-offset-4 hover:underline hover:text-brand-black-olive",
      },
      size: {
        default: "h-11 px-6 py-2.5 sm:h-12 sm:px-7 sm:py-3",
        sm: "h-9 rounded-gentle px-4 sm:h-10 sm:px-5",
        lg: "h-12 rounded-comfortable px-8 text-base sm:h-14 sm:px-10",
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
        className={cn(buttonVariants({ variant, size, className }), "mobile-touch-target")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
