import type { ComponentProps } from 'react'
import { type ReactNode } from 'react'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { Features } from '@/utils/Features'
import type { FetchInsurance } from './FetchInsurance'

type ChildrenProps = Pick<ComponentProps<typeof FetchInsurance>, 'externalInsurer' | 'insurely'>

type Props = {
  priceIntent: PriceIntent
  children: (props: ChildrenProps) => ReactNode
}

export const FetchInsuranceContainer = (props: Props) => {
  if (!Features.enabled('INSURELY')) return null
  if (props.priceIntent.product.name === 'SE_CAR' && !Features.enabled('INSURELY_CAR')) return null
  if (!props.priceIntent.externalInsurer) return null
  if (!props.priceIntent.insurely) return null

  return props.children({
    externalInsurer: props.priceIntent.externalInsurer,
    insurely: props.priceIntent.insurely,
  })
}
