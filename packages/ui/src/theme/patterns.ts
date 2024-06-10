import type { Sprinkles } from './sprinkles.css'
import { sprinkles } from './sprinkles.css'

type StackPatternParams = {
  direction?: 'row' | 'column'
} & Omit<Sprinkles, 'display' | 'flexDirection'>

export const stack = ({ direction = 'column', gap = 'md', ...params }: StackPatternParams) => {
  return sprinkles({ display: 'flex', flexDirection: direction, gap, ...params })
}

type DirectedStackPatternParams = Omit<StackPatternParams, 'direction'>

export const hStack = (params: DirectedStackPatternParams) => {
  return stack({ direction: 'row', ...params })
}

export const vStack = (params: DirectedStackPatternParams) => {
  return stack({ direction: 'column', ...params })
}
