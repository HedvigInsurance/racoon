import { ClaimInsurableLimitsFragment } from 'types/generated/graphql'
import { LimitIndicator } from './LimitIndicator'
import { splitInsurableLimitsCategories } from '../util'
import { Flex } from '@hedvig-ui/redesign'
import { theme } from '@hedvig-ui/redesign/theme'

export const TotalInsurableLimits = ({
  insurableLimits,
}: {
  insurableLimits: ClaimInsurableLimitsFragment
}) => {
  const [fixedDeductibleCategory] =
    splitInsurableLimitsCategories(insurableLimits)
  return (
    <Flex direction="column" gap="medium">
      <LimitIndicator
        displayName="Total"
        usage={insurableLimits.totalUsage.amount}
        limit={insurableLimits.totalLimit.amount}
        currency={insurableLimits.totalUsage.currency}
      />
      <LimitIndicator
        displayName={fixedDeductibleCategory.displayName}
        usage={fixedDeductibleCategory.usage.amount}
        limit={fixedDeductibleCategory.limit.amount}
        currency={fixedDeductibleCategory.usage.currency}
        color={theme.colors.signalBlueElement}
      />
    </Flex>
  )
}
