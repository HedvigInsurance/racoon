import { Market } from '@/lib/types'

const MARKET_VALUES = Object.values(Market)
export const isMarket = (item: unknown): item is Market => {
  return MARKET_VALUES.includes(item as Market)
}

export class QuoteBundleError extends Error {
  constructor(public type: string, public message: string) {
    super(message)
    Object.setPrototypeOf(this, QuoteBundleError.prototype)
  }
}

export const randomEmail = () => {
  const randomId = Math.random().toString(36).substring(2, 5)
  return `sven.svensson.${randomId}@hedvig.com`
}
