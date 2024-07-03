import { useAtomValue } from 'jotai'
import { FetchInsurance } from '@/components/PriceCalculator/FetchInsurance'
import {
  shopSessionCustomerAtom,
  usePriceIntent,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { Features } from '@/utils/Features'

export const FetchInsuranceContainer = () => {
  const shopSessionCustomer = useAtomValue(shopSessionCustomerAtom)
  const priceIntent = usePriceIntent()

  if (!Features.enabled('INSURELY')) return null
  if (priceIntent.product.name === 'SE_CAR' && !Features.enabled('INSURELY_CAR')) return null
  if (!priceIntent.externalInsurer) return null
  if (!priceIntent.insurely) return null

  return (
    <FetchInsurance
      priceIntentId={priceIntent.id}
      customerSsn={shopSessionCustomer?.ssn ?? undefined}
      externalInsurer={priceIntent.externalInsurer}
      insurely={priceIntent.insurely}
      productName={priceIntent.product.name}
    />
  )
}
