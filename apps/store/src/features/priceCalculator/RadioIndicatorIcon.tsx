import clsx from 'clsx'
import { forwardRef } from 'react'
import { IconRoot, type IconRootProps } from 'ui'
import { icon, indicatorBorderColor, indicatorMarkerColor } from './RadioIndicatorIcon.css'

// Single icon can cover all possible radio indicator states based on
// [data-state="checked"|"unchecked"] and [data-disabled] attributes
export const RadioIndicatorIcon = forwardRef<SVGSVGElement, IconRootProps>(
  ({ className, size = '1.5rem', ...props }, ref) => {
    return (
      <IconRoot
        ref={ref}
        className={clsx(icon, className)}
        size={size}
        {...props}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke={indicatorBorderColor} strokeWidth={2} />
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" fill={indicatorMarkerColor} />
      </IconRoot>
    )
  },
)
RadioIndicatorIcon.displayName = 'RadioIndicatorIcon'
