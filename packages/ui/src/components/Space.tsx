import type { CSSObject } from '@emotion/react'
import styled from '@emotion/styled'
import { Level, mq } from '../lib/media-query'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

type BaseProps = {
  x?: number | PartialRecord<Level | 'base', number>
  y?: number | PartialRecord<Level | 'base', number>
}

const config = {
  shouldForwardProp: (prop: string) => !(prop === 'x' || prop === 'y'),
}
export const Space = styled(
  'div',
  config,
)<BaseProps>(({ x, y }) => {
  const styles: CSSObject = {}
  const selector = '> :not([hidden]) ~ :not([hidden])'

  if (typeof x === 'number') {
    styles[selector] = { marginLeft: `${x}rem` }
  } else if (x) {
    const levels = Object.keys(x) as Array<keyof typeof x>
    levels.forEach((level) => {
      if (level === 'base') {
        styles[selector] = { marginLeft: `${x.base}rem` }
      } else {
        styles[mq[level]] = {
          [selector]: { marginLeft: `${x[level]}rem` },
        }
      }
    })
  }

  if (typeof y === 'number') {
    styles[selector] = { marginTop: `${y}rem` }
  } else if (y) {
    const levels = Object.keys(y) as Array<keyof typeof y>
    levels.forEach((level) => {
      if (level === 'base') {
        styles[selector] = { marginTop: `${y.base}rem` }
      } else {
        styles[mq[level]] = {
          [selector]: { marginTop: `${y[level]}rem` },
        }
      }
    })
  }

  return styles
})
