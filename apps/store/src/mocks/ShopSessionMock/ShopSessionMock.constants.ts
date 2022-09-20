import { getOperationName } from '@apollo/client/utilities'
import {
  ShopSessionDocument,
  CartEntryAddDocument,
  CartEntryRemoveDocument,
  ShopSessionCreateDocument,
  StartDateUpdateDocument,
} from '@/services/apollo/generated'

const SHOP_SESSION_CREATE = getOperationName(ShopSessionCreateDocument)
if (SHOP_SESSION_CREATE === null) throw new Error('Can not find ShopSessionCreate operation name')

const SHOP_SESSION = getOperationName(ShopSessionDocument)
if (SHOP_SESSION === null) throw new Error('Can not find ShopSession operation name')

const CART_ENTRY_ADD = getOperationName(CartEntryAddDocument)
if (CART_ENTRY_ADD === null) throw new Error('Can not find CartEntryAdd operation name')

const CART_ENTRY_REMOVE = getOperationName(CartEntryRemoveDocument)
if (CART_ENTRY_REMOVE === null) throw new Error('Can not find CartEntryRemove operation name')

const START_DATE_UPDATE = getOperationName(StartDateUpdateDocument)
if (START_DATE_UPDATE === null) throw new Error('Can not find StartDateUpdate operation name')

export const getConstants = () => ({
  SHOP_SESSION_CREATE,
  SHOP_SESSION,
  CART_ENTRY_ADD,
  CART_ENTRY_REMOVE,
  START_DATE_UPDATE,
})
