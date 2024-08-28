import styled from '@emotion/styled'
import { Badge, formatMoney } from '@hedvig-ui'
import * as React from 'react'
import {
  CampaignFilter,
  CampaignOwnerPartner,
  CostDeduction,
  FreeMonths,
  Incentive,
  IndefinitePercentageDiscount,
  MonthlyPercentageDiscountFixedPeriod,
  NoDiscount,
  UnknownIncentive,
  useAvailableCampaignCodeTypesQuery,
  VisibleNoDiscount,
} from 'types/generated/graphql'

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

type IncentiveDataMaybe = Incentive | null | undefined

export const isMonthlyPercentageDiscountFixedPeriod = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is MonthlyPercentageDiscountFixedPeriod =>
  incentiveData?.__typename === 'MonthlyPercentageDiscountFixedPeriod'

export const isFreeMonths = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is FreeMonths => incentiveData?.__typename === 'FreeMonths'

export const isIndefinitePercentageDiscount = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is IndefinitePercentageDiscount =>
  incentiveData?.__typename === 'IndefinitePercentageDiscount'

export const isCostDeduction = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is CostDeduction =>
  incentiveData?.__typename === 'CostDeduction'

export const isVisibleNoDiscount = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is VisibleNoDiscount =>
  incentiveData?.__typename === 'VisibleNoDiscount'

export const isNoDiscount = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is NoDiscount => incentiveData?.__typename === 'NoDiscount'

export const isUnknownIncentive = (
  incentiveData: IncentiveDataMaybe,
): incentiveData is UnknownIncentive =>
  incentiveData?.__typename === 'UnknownIncentive'

const generateRange = (min: number, max: number, step: number): number[] => {
  return new Array(max).fill(0).map((_, index) => min + index * step)
}

export const numberOfMonthsOptions = generateRange(1, 12, 1).map(
  (noOfMonths) => ({
    label: noOfMonths,
    value: noOfMonths,
    text: noOfMonths,
  }),
)

export const percentageDiscountOptions = generateRange(5, 20, 5).map(
  (percentage) => ({
    label: percentage + '%',
    value: percentage,
    text: percentage + '%',
  }),
)

export const BadgeRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`

export const ValidityText = styled.span`
  font-size: 0.9em;
  display: flex;
  justify-content: center;
`

export const DateTimePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export enum CreatableIncentiveTypes {
  MonthlyPercentageDiscountFixedPeriod = 'Monthly Percentage',
  FreeMonths = 'Free Months',
  NoDiscount = 'No Discount',
  VisibleNoDiscount = 'Visible No Discount',
}

export const initialCampaignFilter: CampaignFilter = {
  code: null,
  partnerId: null,
  activeFrom: null,
  activeTo: null,
}

export const mapCampaignOwners = (
  partnerCampaignOwners: readonly CampaignOwnerPartner[],
) =>
  partnerCampaignOwners.map(({ partnerId }) => ({
    value: partnerId,
    label: partnerId,
  }))

export const getIncentiveText = (incentive?: Incentive | null) => {
  if (incentive === undefined || incentive === null) {
    return '-'
  }

  if (isMonthlyPercentageDiscountFixedPeriod(incentive)) {
    return 'Monthly Percentage'
  }

  if (isFreeMonths(incentive)) {
    return 'Free Months'
  }

  if (isCostDeduction(incentive)) {
    return 'Cost Deduction'
  }

  if (isVisibleNoDiscount(incentive)) {
    return 'Visible No Discount'
  }

  if (isNoDiscount(incentive)) {
    return 'No Discount'
  }
}

const DiscountDetailBadge: React.FC<{ label: string }> = ({ label }) => (
  <Badge variant="success">
    <span style={{ fontWeight: 'bold' }}>{label}</span>
  </Badge>
)

const DiscountMonthBadge: React.FC<{ months?: number | null }> = ({
  months,
}) => {
  if (months === undefined || months === null) {
    return <></>
  }
  return (
    <Badge>
      <span style={{ fontWeight: 'bold' }}>
        {months} {`month${months > 1 ? 's' : ''}`}
      </span>
    </Badge>
  )
}

const ForeverBadge = () => (
  <Badge>
    <span style={{ fontWeight: 'bold' }}>Forever</span>
  </Badge>
)

export const getDiscountDetails = (incentive?: Incentive | null) => {
  if (incentive === undefined || incentive === null) {
    return '-'
  }

  if (isMonthlyPercentageDiscountFixedPeriod(incentive)) {
    return (
      <BadgeRow>
        <DiscountDetailBadge label={`${incentive.percentage}%`} />
        <DiscountMonthBadge months={incentive.numberOfMonths} />
      </BadgeRow>
    )
  }

  if (isFreeMonths(incentive)) {
    return (
      <BadgeRow>
        <DiscountDetailBadge label="Free" />
        <DiscountMonthBadge months={incentive.numberOfMonths} />
      </BadgeRow>
    )
  }

  if (isCostDeduction(incentive)) {
    return (
      <BadgeRow>
        <DiscountDetailBadge
          label={formatMoney(incentive.amount!, { useGrouping: true })}
        />
        <ForeverBadge />
      </BadgeRow>
    )
  }
}

export const formatValidity = (
  validFrom: string | null,
  validTo: string | null,
) => {
  if (!validFrom && !validTo) {
    return <ValidityText>Always</ValidityText>
  }

  if (validFrom && !validTo) {
    return <ValidityText>{validFrom} and onwards</ValidityText>
  }

  if (!validFrom && validTo) {
    return <ValidityText>Up until {validTo}</ValidityText>
  }

  return (
    <ValidityText>
      {validFrom} - {validTo}
    </ValidityText>
  )
}

export const useGetCodeTypeOptions = () => {
  const codeTypesQuery = useAvailableCampaignCodeTypesQuery()
  const codeTypes = codeTypesQuery.data?.availableCampaignCodeTypes ?? []
  return (
    codeTypes.map((value, index) => {
      return {
        key: index + 1,
        value,
        label: (value as string).split('_').map(capitalize).join(' '),
      }
    }) ?? []
  )
}
