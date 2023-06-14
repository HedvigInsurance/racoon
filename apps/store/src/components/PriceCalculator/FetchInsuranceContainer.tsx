import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { Features } from '@/utils/Features'
import { FetchInsurance } from './FetchInsurance'

type Props = {
  priceIntent: PriceIntent
}

export const FetchInsuranceContainer = ({ priceIntent }: Props) => {
  if (!Features.enabled('INSURELY')) return null
  if (priceIntent.product.name === 'SE_CAR' && !Features.enabled('INSURELY_CAR')) return null
  if (!priceIntent.externalInsurer) return null
  if (!priceIntent.insurelyConfigName) return null

  return (
    <FetchInsurance
      priceIntentId={priceIntent.id}
      externalInsurer={priceIntent.externalInsurer}
      insurelyConfigName={priceIntent.insurelyConfigName}
      productName={priceIntent.product.displayNameShort}
    />
  )
}
