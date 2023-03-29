import { CSSObject } from '@emotion/react'
import { Level, mq } from '../../lib/media-query'
import { theme } from '../../lib/theme/theme'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

type BadgeSize = 'sm' | 'lg'

export type BadgeSizeProps = BadgeSize | PartialRecord<Level | '_', BadgeSize>

export const getBadgeSize = (sizes: BadgeSizeProps): CSSObject => {
  if (typeof sizes !== 'object') {
    return STYLES[sizes]
  }

  let styles = {} as CSSObject

  const breakpoints = Object.keys(sizes) as Array<keyof typeof sizes>
  breakpoints.forEach((breakpoint) => {
    const sizeAtBreakpoint = sizes[breakpoint]
    if (!sizeAtBreakpoint) {
      return
    }
    if (breakpoint === '_') {
      // Default
      const baseStyles = STYLES[sizeAtBreakpoint]
      styles = { ...baseStyles, ...styles }
    } else {
      styles[mq[breakpoint as Level]] = {
        ...STYLES[sizeAtBreakpoint],
      }
    }
  })
  return styles
}

const STYLES: Record<BadgeSize, CSSObject> = {
  sm: {
    paddingBlock: theme.space.xxs,
    paddingInline: theme.space.xs,
    fontSize: theme.fontSizes.sm,
  },
  lg: {
    paddingBlock: theme.space.xs,
    paddingInline: theme.space.sm,
    fontSize: theme.fontSizes.md,
    lineHeight: theme.fontSizes.md,
  },
}
