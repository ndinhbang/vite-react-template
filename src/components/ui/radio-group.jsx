import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (<RadioGroupPrimitive.Root className={cn("bgrid bgap-2", className)} {...props} ref={ref} />);
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "baspect-square bh-4 bw-4 brounded-full bborder bborder-primary btext-primary bring-offset-background focus:boutline-none focus-visible:bring-2 focus-visible:bring-ring focus-visible:bring-offset-2 disabled:bcursor-not-allowed disabled:bopacity-50",
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator className="bflex bitems-center bjustify-center">
        <Circle className="bh-2.5 bw-2.5 bfill-current btext-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>)
  );
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
