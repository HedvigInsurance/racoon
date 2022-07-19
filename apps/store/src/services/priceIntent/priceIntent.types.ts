import type {
  PriceIntentCreateMutationVariables,
  PriceIntentDataUpdateMutationVariables,
} from '@/services/graphql/generated'

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

export type PriceIntentCreateParams = Omit<PriceIntentCreateMutationVariables, 'shopSessionId'>
export type PriceIntentDataUpdateParams = PriceIntentDataUpdateMutationVariables

export interface SimplePersister {
  save(id: string): Promise<void>
  fetch(): Promise<string | null>
  reset(): Promise<void>
}
