export type SaveParams<Data> = { id: string; data: Data }

export interface Persister<Data> {
  save(params: SaveParams<Data>): Promise<void>
  fetch(id: string): Promise<Data | null>
  fetchLatest(): Promise<string | null>
  reset(): Promise<void>
}

type PriceQuote = { id: string; price: number }

export type PriceForm = {
  id: string
  data: Record<string, string>
  product: { id: string }
  priceQuote: null | PriceQuote
}
