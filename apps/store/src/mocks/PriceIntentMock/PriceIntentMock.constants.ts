import { getOperationName } from '@apollo/client/utilities'
import {
  ShopSessionDocument,
  ShopSessionCreateDocument,
  PriceIntentDocument,
  PriceIntentCreateDocument,
  PriceIntentDataUpdateDocument,
  PriceIntentConfirmDocument,
} from '@/services/graphql/generated'

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
if (GRAPHQL_ENDPOINT === undefined) throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined')

const SHOP_SESSION = getOperationName(ShopSessionDocument)
if (SHOP_SESSION === null) throw new Error('Can not find ShopSession operation name')

const SHOP_SESSION_CREATE = getOperationName(ShopSessionCreateDocument)
if (SHOP_SESSION_CREATE === null) throw new Error('Can not find ShopSessionCreate operation name')

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
  GRAPHQL_ENDPOINT,
  SHOP_SESSION,
  SHOP_SESSION_CREATE,
  PRICE_INTENT,
  PRICE_INTENT_CREATE,
  PRICE_INTENT_DATA_UPDATE,
  PRICE_INTENT_CONFIRM,
})
