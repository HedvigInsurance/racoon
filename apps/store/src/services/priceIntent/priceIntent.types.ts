import type {
  PriceIntentCreateMutationVariables,
  PriceIntentDataUpdateMutationVariables,
  PriceIntentQuery,
} from '@/services/apollo/generated'
import { Template } from '@/services/PriceForm/PriceForm.types'

export type PriceIntentCreateParams = Omit<PriceIntentCreateMutationVariables, 'shopSessionId'> & {
  priceTemplate: Template
}
export type PriceIntentDataUpdateParams = Omit<
  PriceIntentDataUpdateMutationVariables,
  'shopSessionId'
>

export type PriceIntent = Exclude<PriceIntentQuery['shopSession']['priceIntent'], null | undefined>
