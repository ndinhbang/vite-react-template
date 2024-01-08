import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "bflex bh-10 bw-full brounded-md bborder bborder-input bbg-background bpx-3 bpy-2 btext-sm bring-offset-background file:bborder-0 file:bbg-transparent file:btext-sm file:bfont-medium placeholder:btext-muted-foreground focus-visible:boutline-none focus-visible:bring-2 focus-visible:bring-ring focus-visible:bring-offset-2 disabled:bcursor-not-allowed disabled:bopacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
