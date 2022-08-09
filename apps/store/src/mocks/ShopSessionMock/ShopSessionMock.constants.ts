import { getOperationName } from '@apollo/client/utilities'
import {
  CartLinesAddDocument,
  CartLinesRemoveDocument,
  ShopSessionCreateDocument,
  ShopSessionDocument,
} from '@/services/graphql/generated'

const SHOP_SESSION_CREATE = getOperationName(ShopSessionCreateDocument)
if (SHOP_SESSION_CREATE === null) throw new Error('Can not find ShopSessionCreate operation name')

const SHOP_SESSION = getOperationName(ShopSessionDocument)
if (SHOP_SESSION === null) throw new Error('Can not find ShopSession operation name')

const CART_LINES_ADD = getOperationName(CartLinesAddDocument)
if (CART_LINES_ADD === null) throw new Error('Can not find CartLinesAdd operation name')

const CART_LINES_REMOVE = getOperationName(CartLinesRemoveDocument)
if (CART_LINES_REMOVE === null) throw new Error('Can not find CartLinesRemove operation name')

export const getConstants = () => ({
  SHOP_SESSION_CREATE,
  SHOP_SESSION,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
})
