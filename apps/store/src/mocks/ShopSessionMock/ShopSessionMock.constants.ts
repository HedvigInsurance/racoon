import { getOperationName } from '@apollo/client/utilities'
import { ShopSessionDocument, ShopSessionCreateDocument } from '@/services/graphql/generated'

const SHOP_SESSION = getOperationName(ShopSessionDocument)
if (SHOP_SESSION === null) throw new Error('Can not find ShopSession operation name')

const SHOP_SESSION_CREATE = getOperationName(ShopSessionCreateDocument)
if (SHOP_SESSION_CREATE === null) throw new Error('Can not find ShopSessionCreate operation name')

export const getConstants = () => ({
  SHOP_SESSION,
  SHOP_SESSION_CREATE,
})
