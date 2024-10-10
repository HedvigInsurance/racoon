import clsx from 'clsx'
import { sprinkles, type Sprinkles } from '../theme'

type StackPatternParams = {
  columns?: number | string
  rows?: number | string
  className?: string
} & Omit<Sprinkles, 'display' | 'flexDirection' | 'flexGrow'>

export const grid = ({ columns, rows, className, ...sprinklesProps }: StackPatternParams) => {
  const classNames = clsx(className, sprinkles({ display: 'grid', ...sprinklesProps }))
  const styleObject = {
    ...(columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : {}),
    ...(rows ? { gridTemplateRows: `repeat(${rows}, 1fr)` } : {}),
  }

  return {
    className: classNames,
    style: styleObject,
  }
}
