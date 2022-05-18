import { Market } from '@/lib/types'

const MARKET_VALUES = Object.values(Market)
export const isMarket = (item: unknown): item is Market => {
  return MARKET_VALUES.includes(item as Market)
}
