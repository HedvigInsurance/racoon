import { getOperationName } from '@apollo/client/utilities'
import {
  CartDocument,
  CartLinesAddDocument,
  CartLinesRemoveDocument,
} from '@/services/graphql/generated'

const CART = getOperationName(CartDocument)
if (CART === null) throw new Error('Can not find Cart operation name')

const CART_LINES_ADD = getOperationName(CartLinesAddDocument)
if (CART_LINES_ADD === null) throw new Error('Can not find CartLinesAdd operation name')

const CART_LINES_REMOVE = getOperationName(CartLinesRemoveDocument)
if (CART_LINES_REMOVE === null) throw new Error('Can not find CartLinesRemove operation name')

export const getConstants = () => ({
  CART,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
})
