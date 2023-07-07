import styled from '@emotion/styled'
import { Text, theme } from 'ui'
import { CartCampaign } from './CartInventory.types'

type Props = {
  campaigns: Array<CartCampaign>
}

export const ReadOnlyCampaignCodeList = ({ campaigns }: Props) => {
  if (campaigns.length === 0) {
    return null
  }

  return (
    <ul>
      {campaigns.map((item) => (
        <li key={item.id}>
          <SpaceBetween>
            <Chip>
              <Text as="span" size="xs">
                {item.code}
              </Text>
            </Chip>
            <Text>{item.discountExplanation}</Text>
          </SpaceBetween>
        </li>
      ))}
    </ul>
  )
}

const SpaceBetween = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.xs,
})

const Chip = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xxs,
  borderRadius: theme.radius.xxs,
  backgroundColor: theme.colors.gray200,
  textTransform: 'uppercase',
  paddingTop: theme.space.xxs,
  paddingBottom: theme.space.xxs,
  paddingLeft: theme.space.xs,
  paddingRight: theme.space.xs,
})
