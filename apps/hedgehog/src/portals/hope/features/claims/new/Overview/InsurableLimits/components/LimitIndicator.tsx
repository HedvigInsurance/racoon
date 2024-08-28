import { ReactNode } from 'react'
import { formatMoney } from '@hedvig-ui'
import { FillBar, Flex, Grid } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const LimitIndicator = ({
  displayName,
  usage,
  limit,
  currency,
  color,
}: {
  displayName: ReactNode
  usage: number
  limit: number
  currency: string
  color?: string
}) => {
  return (
    <Grid gap="small" className={cssUtil.textSmaller}>
      <span>{displayName}</span>
      <FillBar max={limit} parts={[{ value: usage }]} color={color} />
      <Flex justify="space-between" className={cssUtil.textMuted}>
        <span>{formatMoney({ amount: usage, currency })} used</span>
        <span>{formatMoney({ amount: limit - usage, currency })} left</span>
      </Flex>
    </Grid>
  )
}
