import { Level, mq } from '../lib/media-query'
import React, { Children, Fragment } from 'react'

import type { CSSObject } from '@emotion/react'
import styled from '@emotion/styled'

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

type BaseProps = {
  x?: number | PartialRecord<Level | 'base', number>
  y?: number | PartialRecord<Level | 'base', number>
}

type SeparateProps = BaseProps & {
  children: React.ReactNode
  Separator?: React.ReactNode
  className?: string
  as?: React.ElementType
}

const SPACING_BASIS = '1rem'

const DefaultSeparator = styled.div<BaseProps>({}, ({ x, y }) => {
  const styles: CSSObject = {}

  if (typeof x === 'number') {
    styles.width = x && `calc(${x} * ${SPACING_BASIS})`
  } else if (x) {
    const levels = Object.keys(x) as Array<keyof typeof x>
    levels.forEach((level) => {
      if (level === 'base') {
        styles.width = `calc(${x.base} * ${SPACING_BASIS})`
      } else {
        styles[mq[level]] = {
          width: `calc(${x[level]} * ${SPACING_BASIS})`,
        }
      }
    })
  }

  if (typeof y === 'number') {
    styles.height = y && `calc(${y} * ${SPACING_BASIS})`
  } else if (y) {
    const levels = Object.keys(y) as Array<keyof typeof y>
    levels.forEach((level) => {
      if (level === 'base') {
        styles.height = `calc(${y.base} * ${SPACING_BASIS})`
      } else {
        styles[mq[level]] = {
          height: `calc(${y[level]} * ${SPACING_BASIS})`,
        }
      }
    })
  }

  return styles
})

export const Separate = ({
  children,
  Separator,
  className,
  as: Element = 'div',
  ...rest
}: SeparateProps) => {
  const array = Children.toArray(children)

  const childrenWithSeparators = array.map((childItem, index) => (
    <Fragment key={index}>
      {index > 0 &&
        ((
          <>
            <DefaultSeparator {...rest} />
            {Separator}
            <DefaultSeparator {...rest} />
          </>
        ) ?? <DefaultSeparator {...rest} />)}
      {childItem}
    </Fragment>
  ))

  if (className) {
    return <Element className={className}>{childrenWithSeparators}</Element>
  }

  return <>{childrenWithSeparators}</>
}
