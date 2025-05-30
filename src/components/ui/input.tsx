import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

function Input({ inputLabel,className, type, ...props }: React.ComponentProps<"input"> & {inputLabel?:string}) {
  return (
    <div className=" w-full gap-2 flex flex-col">
    <Label className=" text-neutral-100">{inputLabel}</Label>
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-neutral-300  text-neutral-100 placeholder:text-neutral-300 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
    </div>
  )
}

export { Input }
