
import type { CSSObject } from '@emotion/react'
import styled from '@emotion/styled'
import { Level, mq } from '../lib/media-query'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

type BaseProps = {
  x?: number | PartialRecord<Level | 'base', number>
  y?: number | PartialRecord<Level | 'base', number>
}

export const Space = styled.div<BaseProps>({}, ({ x, y }) => {
  const styles: CSSObject = {}
  const selector = '> :not([hidden]) ~ :not([hidden])'

  const horizontalStyles: CSSObject = { marginLeft: `${x}rem` }

  if (typeof x === 'number') {
    styles[selector] = horizontalStyles
  } else if (x) {
    const levels = Object.keys(x) as Array<keyof typeof x>
    levels.forEach((level) => {
      if (level === 'base') {
        styles[selector] = horizontalStyles
      } else {
        styles[mq[level]] = {
          [selector]: horizontalStyles,
        }
      }
    })
  }

  const verticalStyles: CSSObject = { marginTop: `${y}rem` }
  if (typeof y === 'number') {
    styles[selector] = verticalStyles
  } else if (y) {
    const levels = Object.keys(y) as Array<keyof typeof y>
    levels.forEach((level) => {
      if (level === 'base') {
        styles[selector] = verticalStyles
      } else {
        styles[mq[level]] = {
          [selector]: verticalStyles,
        }
      }
    })
  }

  return styles
})
