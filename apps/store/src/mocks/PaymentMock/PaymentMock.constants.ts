import { getOperationName } from '@apollo/client/utilities'
import { PaymentProvidersDocument } from '@/services/apollo/generated'

const PAYMENT_PROVIDERS = getOperationName(PaymentProvidersDocument)
if (PAYMENT_PROVIDERS === null) throw new Error('Can not find PaymentProviders operation name')

export const getConstants = () => ({
  PAYMENT_PROVIDERS,
})
