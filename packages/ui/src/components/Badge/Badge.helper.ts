import { CSSObject } from '@emotion/react'
import { theme } from '../../theme'
import { Level, mq } from '../../theme/media-query'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

type BadgeSize = 'small' | 'big'

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
      styles[mq[breakpoint]] = {
        ...STYLES[sizeAtBreakpoint],
      }
    }
  })
  return styles
}

const STYLES: Record<BadgeSize, CSSObject> = {
  small: {
    paddingBlock: theme.space.xxs,
    paddingInline: theme.space.xs,
    fontSize: theme.fontSizes.sm,
  },
  big: {
    paddingBlock: theme.space.xs,
    paddingInline: theme.space.sm,
    fontSize: theme.fontSizes.md,
    lineHeight: theme.fontSizes.md,
  },
}
