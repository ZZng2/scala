import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Scala Button Variants
 * PRD 기준:
 * - Primary: #FF6B35 배경, 흰색 텍스트
 * - Secondary: 회색 아웃라인
 * - Ghost: 투명 배경
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Scala Primary (Dongguk Orange)
        default:
          "bg-[#FF6B35] text-white hover:bg-[#E55A2A] shadow-[0px_4px_12px_rgba(255,107,53,0.3)]",
        // Primary with no shadow
        primary:
          "bg-[#FF6B35] text-white hover:bg-[#E55A2A]",
        // Secondary (Gray Outline - PRD: "이전" 버튼)
        secondary:
          "border border-[#E0E0E0] bg-white text-[#212121] hover:bg-[#F8F9FA]",
        // Outline (Similar to secondary but with stronger border)
        outline:
          "border border-[#BDBDBD] bg-transparent text-[#212121] hover:bg-[#F8F9FA]",
        // Ghost (Transparent)
        ghost:
          "bg-transparent text-[#212121] hover:bg-[#F8F9FA]",
        // Destructive
        destructive:
          "bg-[#F44336] text-white hover:bg-[#D32F2F]",
        // Link style
        link:
          "text-[#FF6B35] underline-offset-4 hover:underline bg-transparent",
        // White button (for Sticky Bar CTA)
        white:
          "bg-white text-[#FF6B35] hover:bg-white/90 font-bold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base",
        // Mobile CTA (PRD: 48px height)
        cta: "h-12 px-6 text-base font-bold rounded-lg",
        // Large CTA for landing page
        "cta-lg": "h-14 px-8 text-lg font-bold rounded-2xl",
        // Small inline button
        inline: "h-8 px-4 text-sm rounded-full",
        // Icon only
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
