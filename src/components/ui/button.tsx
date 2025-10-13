import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105 focus-visible:ring-purple-400",
        destructive:
          "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-md hover:from-red-600 hover:to-orange-700 hover:shadow-lg transform hover:scale-105 focus-visible:ring-red-400",
        outline:
          "border-2 border-purple-500 bg-white text-purple-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-600 shadow-sm hover:shadow-md focus-visible:ring-purple-400",
        secondary:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105 focus-visible:ring-blue-400",
        success:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105 focus-visible:ring-green-400",
        warning:
          "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:from-yellow-500 hover:to-orange-600 hover:shadow-lg transform hover:scale-105 focus-visible:ring-yellow-400",
        ghost:
          "text-purple-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 focus-visible:ring-purple-400",
        link: "text-purple-600 underline-offset-4 hover:underline hover:text-purple-700",
      },
      size: {
        default: "h-10 px-6 py-2.5 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
