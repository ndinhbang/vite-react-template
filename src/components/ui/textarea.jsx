import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "bflex bmin-h-[80px] bw-full brounded-md bborder bborder-input bbg-background bpx-3 bpy-2 btext-sm bring-offset-background placeholder:btext-muted-foreground focus-visible:boutline-none focus-visible:bring-2 focus-visible:bring-ring focus-visible:bring-offset-2 disabled:bcursor-not-allowed disabled:bopacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
