import { ClaimInsurableLimitsFragment } from 'types/generated/graphql'
import { splitInsurableLimitsCategories } from '@hope/features/claims/new/Overview/InsurableLimits/util'
import { LimitIndicator } from './LimitIndicator'

type Props = {
  insurableLimits: ClaimInsurableLimitsFragment
}

export const ClaimInsurableLimitsDetails = (props: Props) => {
  const insurableLimits = props.insurableLimits
  const [, otherCategories] = splitInsurableLimitsCategories(insurableLimits)

  return (
    <>
      {otherCategories.map((category) => (
        <LimitIndicator
          key={category.id}
          displayName={category.displayName}
          usage={category.usage.amount}
          limit={category.limit.amount}
          currency={category.usage.currency}
        />
      ))}
    </>
  )
}
