
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-light text-black transition-opacity duration-200 focus-visible:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:opacity-70 border-b border-transparent hover:border-black pb-px",
        destructive: "text-red-600 hover:opacity-70",
        outline: "border-b border-gray-300 hover:border-black pb-px hover:opacity-70",
        secondary: "text-gray-600 hover:text-black hover:opacity-70",
        ghost: "hover:opacity-70",
        link: "underline-offset-4 hover:underline opacity-70 hover:opacity-100",
      },
      size: {
        default: "text-xs uppercase tracking-widest px-0 py-2",
        sm: "text-xs uppercase tracking-widest px-0 py-1",
        lg: "text-sm uppercase tracking-widest px-0 py-3",
        icon: "h-auto w-auto p-0",
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
