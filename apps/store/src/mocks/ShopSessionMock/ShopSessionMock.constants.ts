import { getOperationName } from '@apollo/client/utilities'
import {
  ShopSessionFindOrCreateDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
} from '@/services/graphql/generated'

const SHOP_SESSION_FIND_OR_CREATE = getOperationName(ShopSessionFindOrCreateDocument)
if (SHOP_SESSION_FIND_OR_CREATE === null)
  throw new Error('Can not find ShopSessionFindOrCreate operation name')

const CART_LINES_ADD = getOperationName(CartLinesAddDocument)
if (CART_LINES_ADD === null) throw new Error('Can not find CartLinesAdd operation name')

const CART_LINES_REMOVE = getOperationName(CartLinesRemoveDocument)
if (CART_LINES_REMOVE === null) throw new Error('Can not find CartLinesRemove operation name')

export const getConstants = () => ({
  SHOP_SESSION_FIND_OR_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
})
