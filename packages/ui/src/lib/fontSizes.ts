import { CSSObject } from '@emotion/react'
import { Level, mq } from './media-query'
import { FontSizes, fontSizes } from './theme/typography'

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type FontSizeProps = FontSizes | PartialRecord<Level | '_', FontSizes>

export const getFontSize = (sizes: FontSizeProps): CSSObject => {
  if (typeof sizes !== 'object') {
    return { fontSize: fontSizes[sizes] }
  }
  const styles = {} as CSSObject

  const breakpoints = Object.keys(sizes) as Array<keyof typeof sizes>
  breakpoints.forEach((breakpoint) => {
    const sizeAtBreakpoint = sizes[breakpoint]
    if (!sizeAtBreakpoint) {
      return
    }
    if (breakpoint === '_') {
      // Default
      styles.fontSize = fontSizes[sizeAtBreakpoint]
    } else {
      styles[mq[breakpoint]] = {
        fontSize: fontSizes[sizeAtBreakpoint],
      }
    }
  })
  return styles
}
