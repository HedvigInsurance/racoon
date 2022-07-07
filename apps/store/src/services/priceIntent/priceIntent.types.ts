export type SaveParams<Data> = { id: string; data: Data }

export interface Persister<Data> {
  save(params: SaveParams<Data>): Promise<void>
  fetch(id: string): Promise<Data | null>
  fetchLatest(): Promise<string | null>
  reset(): Promise<void>
}

type PriceIntentProduct = { id: string; price: number }

export type PriceIntent = {
  id: string
  data: Record<string, string>
  product: null | PriceIntentProduct
}
