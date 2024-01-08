import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "bflex bh-10 bw-full bitems-center bjustify-between brounded-md bborder bborder-input bbg-background bpx-3 bpy-2 btext-sm bring-offset-background placeholder:btext-muted-foreground focus:boutline-none focus:bring-2 focus:bring-ring focus:bring-offset-2 disabled:bcursor-not-allowed disabled:bopacity-50 [&>span]:bline-clamp-1",
      className
    )}
    {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="bh-4 bw-4 bopacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("bflex bcursor-default bitems-center bjustify-center bpy-1", className)}
    {...props}>
    <ChevronUp className="bh-4 bw-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("bflex bcursor-default bitems-center bjustify-center bpy-1", className)}
    {...props}>
    <ChevronDown className="bh-4 bw-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "brelative bz-50 bmax-h-96 bmin-w-[8rem] boverflow-hidden brounded-md bborder bbg-popover btext-popover-foreground bshadow-md data-[state=open]:banimate-in data-[state=closed]:banimate-out data-[state=closed]:bfade-out-0 data-[state=open]:bfade-in-0 data-[state=closed]:bzoom-out-95 data-[state=open]:bzoom-in-95 data-[side=bottom]:bslide-in-from-top-2 data-[side=left]:bslide-in-from-right-2 data-[side=right]:bslide-in-from-left-2 data-[side=top]:bslide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:btranslate-y-1 data-[side=left]:b-translate-x-1 data-[side=right]:btranslate-x-1 data-[side=top]:b-translate-y-1",
        className
      )}
      position={position}
      {...props}>
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn("bp-1", position === "popper" &&
          "bh-[var(--radix-select-trigger-height)] bw-full bmin-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("bpy-1.5 bpl-8 bpr-2 btext-sm bfont-semibold", className)}
    {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "brelative bflex bw-full bcursor-default bselect-none bitems-center brounded-sm bpy-1.5 bpl-8 bpr-2 btext-sm boutline-none focus:bbg-accent focus:btext-accent-foreground data-[disabled]:bpointer-events-none data-[disabled]:bopacity-50",
      className
    )}
    {...props}>
    <span
      className="babsolute bleft-2 bflex bh-3.5 bw-3.5 bitems-center bjustify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="bh-4 bw-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("b-mx-1 bmy-1 bh-px bbg-muted", className)}
    {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
