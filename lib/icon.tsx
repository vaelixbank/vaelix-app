import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../app/lib/utils"

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface IconProps
  extends React.HTMLAttributes<SVGSVGElement>,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon
  size?: number
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, icon: IconComponent, size = 16, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({}), className)}
        size={size}
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"

export { Icon, iconVariants }
export default Icon