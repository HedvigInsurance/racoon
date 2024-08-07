import type { CSSObject } from '@emotion/styled'
import type { Level } from 'ui'
import { mq } from 'ui'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type ColumnWidth = '1' | '5/6' | '2/3' | '1/2' | '1/3'
export type ContentAlignment = 'left' | 'center' | 'right'
export type ContentWidth = ColumnWidth | PartialRecord<Level | 'base', ColumnWidth>

const breakpointsOrder = ['base', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

export const getGridLayout = (width: ContentWidth, align: ContentAlignment = 'left'): CSSObject => {
  if (typeof width !== 'object') {
    return STYLES[width][align]
  }

  let styles: CSSObject = {}

  const breakpoints = Object.keys(width) as Array<keyof typeof width>
  // Media queries need to be sorted
  breakpoints.sort(function (a, b) {
    return breakpointsOrder.indexOf(a) - breakpointsOrder.indexOf(b)
  })
  breakpoints.forEach((breakpoint) => {
    const sizeAtBreakpoint = width[breakpoint]
    if (!sizeAtBreakpoint) {
      return
    }
    if (breakpoint === 'base') {
      // Default
      const baseStyles = RESPONSIVE_STYLES[sizeAtBreakpoint][align]
      styles = { ...baseStyles, ...styles }
    } else {
      styles[mq[breakpoint]] = {
        ...RESPONSIVE_STYLES[sizeAtBreakpoint][align],
      }
    }
  })
  return styles
}

const RESPONSIVE_STYLES: Record<ColumnWidth, Record<ContentAlignment, CSSObject>> = {
  '1': {
    left: { gridColumn: '1 / span 12' },
    center: { gridColumn: '1 / span 12' },
    right: { gridColumn: '1 / span 12' },
  },
  '5/6': {
    left: { gridColumn: '1 / span 10' },
    center: { gridColumn: '2 / span 10' },
    right: { gridColumn: '3 / span 10' },
  },
  '2/3': {
    left: { gridColumn: 'auto / span 8' },
    center: { gridColumn: '3 / span 8' },
    right: { gridColumn: '5 / span 8' },
  },
  '1/2': {
    left: { gridColumn: 'auto / span 6' },
    center: { gridColumn: '4 / span 6' },
    right: { gridColumn: '7 / span 6' },
  },
  '1/3': {
    left: { gridColumn: 'auto / span 4' },
    center: { gridColumn: '5 / span 4' },
    right: { gridColumn: '9 / span 4' },
  },
}

const twoThirdsCenterStyles: CSSObject = {
  [mq.lg]: { gridColumn: '3 / span 8' },
}

const halfCenterStyles: CSSObject = {
  [mq.md]: { gridColumn: '2 / span 10' },
  [mq.lg]: { gridColumn: '4 / span 6' },
}

const halfLeftStyles: CSSObject = {
  [mq.lg]: { gridColumn: 'span 6' },
}

const halfRightStyles: CSSObject = {
  [mq.lg]: { gridColumn: '7 / span 6' },
}

const thirdCenterStyles: CSSObject = {
  [mq.md]: { gridColumn: '3 / span 8' },
  [mq.lg]: { gridColumn: '4 / span 6' },
  [mq.xl]: { gridColumn: '5 / span 4' },
}

const thirdLeftStyles: CSSObject = {
  [mq.md]: { gridColumn: 'auto / span 8' },
  [mq.lg]: { gridColumn: 'auto / span 6' },
  [mq.xl]: { gridColumn: 'auto / span 4' },
}

const fiveSixthsCenterStyles: CSSObject = {
  [mq.lg]: { gridColumn: '2 / span 10' },
}

export const STYLES: Record<ColumnWidth, Record<ContentAlignment, CSSObject>> = {
  '1': { left: {}, center: {}, right: {} },
  '5/6': { left: {}, center: fiveSixthsCenterStyles, right: {} },
  '2/3': {
    left: {},
    center: twoThirdsCenterStyles,
    right: {},
  },
  '1/2': {
    left: halfLeftStyles,
    center: halfCenterStyles,
    right: halfRightStyles,
  },
  '1/3': {
    left: thirdLeftStyles,
    center: thirdCenterStyles,
    right: {},
  },
}
