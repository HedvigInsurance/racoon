import { CSSObject } from '@emotion/react'
import { Level, mq } from '../lib/media-query'
import { FontSizes, fontSizes } from './theme/typography'

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type FontSizeProps = FontSizes | PartialRecord<Level | '_', FontSizes>

export const getFontSize = (sizes: FontSizeProps) => {
  let styles: CSSObject = {}
  if (typeof sizes === 'number') {
    styles = { fontSize: fontSizes[sizes] }
  } else if (sizes) {
    const breakpoints = Object.keys(sizes) as Array<keyof typeof sizes>

    breakpoints.forEach((breakpoint) => {
      const size = sizes[breakpoint]
      if (!size) {
        return
      }

      if (breakpoint === '_') {
        styles = { fontSize: fontSizes[size] }
      } else {
        styles[mq[breakpoint as Level]] = {
          fontSize: fontSizes[size],
        }
      }
    })
  }

  return styles
}
