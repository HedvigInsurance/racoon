import type {
  PriceIntentCreateMutationVariables,
  PriceIntentDataUpdateMutationVariables,
} from '@/services/graphql/generated'

export type PriceIntentCreateParams = Omit<PriceIntentCreateMutationVariables, 'shopSessionId'>
export type PriceIntentDataUpdateParams = Omit<
  PriceIntentDataUpdateMutationVariables,
  'shopSessionId'
>

export interface SimplePersister {
  save(id: string): void
  fetch(): string | null
  reset(): void
}
