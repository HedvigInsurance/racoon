import { getOperationName } from '@apollo/client/utilities'
import {
  PriceIntentDocument,
  PriceIntentCreateDocument,
  PriceIntentDataUpdateDocument,
  PriceIntentConfirmDocument,
} from '@/services/graphql/generated'

const PRICE_INTENT = getOperationName(PriceIntentDocument)
if (PRICE_INTENT === null) throw new Error('Can not find PriceIntent operation name')

const PRICE_INTENT_CREATE = getOperationName(PriceIntentCreateDocument)
if (PRICE_INTENT_CREATE === null) throw new Error('Can not find PriceIntentCreate operation name')

const PRICE_INTENT_DATA_UPDATE = getOperationName(PriceIntentDataUpdateDocument)
if (PRICE_INTENT_DATA_UPDATE === null)
  throw new Error('Can not find PriceIntentDataUpdate operation name')

const PRICE_INTENT_CONFIRM = getOperationName(PriceIntentConfirmDocument)
if (PRICE_INTENT_CONFIRM === null) throw new Error('Can not find PriceIntentConfirm operation name')

export const getConstants = () => ({
  PRICE_INTENT,
  PRICE_INTENT_CREATE,
  PRICE_INTENT_DATA_UPDATE,
  PRICE_INTENT_CONFIRM,
})
