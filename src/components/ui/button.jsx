import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "binline-flex bitems-center bjustify-center bwhitespace-nowrap brounded-md btext-sm bfont-medium bring-offset-background btransition-colors focus-visible:boutline-none focus-visible:bring-2 focus-visible:bring-ring focus-visible:bring-offset-2 disabled:bpointer-events-none disabled:bopacity-50",
  {
    variants: {
      variant: {
        default: "bbg-primary btext-primary-foreground hover:bbg-primary/90",
        destructive:
          "bbg-destructive btext-destructive-foreground hover:bbg-destructive/90",
        outline:
          "bborder bborder-input bbg-background hover:bbg-accent hover:btext-accent-foreground",
        secondary:
          "bbg-secondary btext-secondary-foreground hover:bbg-secondary/80",
        ghost: "hover:bbg-accent hover:btext-accent-foreground",
        link: "btext-primary bunderline-offset-4 hover:bunderline",
      },
      size: {
        default: "bh-10 bpx-4 bpy-2",
        sm: "bh-9 brounded-md bpx-3",
        lg: "bh-11 brounded-md bpx-8",
        icon: "bh-10 bw-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
