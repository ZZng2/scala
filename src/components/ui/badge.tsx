import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Scala Badge Variants
 * PRD 기준:
 * - 등록금: Blue (#EFF6FF / #2563EB)
 * - 생활비: Green (#F0FDF4 / #16A34A)
 * - 복합: Purple (#FAF5FF / #9333EA)
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#FF6B35] text-white",
        secondary:
          "border-transparent bg-[#F8F9FA] text-[#212121]",
        outline:
          "border-[#E0E0E0] text-[#757575]",
        // Scholarship Category Badges
        tuition:
          "border-transparent bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE]",
        living:
          "border-transparent bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7]",
        mixed:
          "border-transparent bg-[#FAF5FF] text-[#9333EA] hover:bg-[#F3E8FF]",
        // D-Day Badge
        dday:
          "border-transparent bg-[#FFF7ED] text-[#FF6B35] font-bold",
        // Closed Badge
        closed:
          "border-transparent bg-[#F5F5F5] text-[#757575]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"
    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
