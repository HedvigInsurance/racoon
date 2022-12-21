import styled from '@emotion/styled'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { useFormatter } from '@/utils/useFormatter'
import { CartCost } from './CartInventory.types'

type Props = CartCost

export const CostSummary = ({ total, crossOut }: Props) => {
  const formatter = useFormatter()

  return (
    <SpaceBetween>
      <Text size="l">Totalt</Text>
      <SpaceFlex space={0.5}>
        {crossOut && (
          <CrossOutText size="l" color="textSecondary">
            {formatter.monthlyPrice(crossOut)}
          </CrossOutText>
        )}
        <Text size="l">{formatter.monthlyPrice(total)}</Text>
      </SpaceFlex>
    </SpaceBetween>
  )
}

const SpaceBetween = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const CrossOutText = styled(Text)({ textDecoration: 'line-through' })
