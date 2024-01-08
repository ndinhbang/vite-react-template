import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "bpeer bh-4 bw-4 bshrink-0 brounded-sm bborder bborder-primary bring-offset-background focus-visible:boutline-none focus-visible:bring-2 focus-visible:bring-ring focus-visible:bring-offset-2 disabled:bcursor-not-allowed disabled:bopacity-50 data-[state=checked]:bbg-primary data-[state=checked]:btext-primary-foreground",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn("bflex bitems-center bjustify-center btext-current")}>
      <Check className="bh-4 bw-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
