import styled from '@emotion/styled'
import { Text, theme } from 'ui'
import { CartCampaign } from './CartInventory.types'

type Props = {
  campaign: CartCampaign
}

export const ReadOnlyCampaignSection = ({ campaign }: Props) => {
  return (
    <SpaceBetween>
      <Chip>
        <Text as="span" size="xs">
          {campaign.code}
        </Text>
      </Chip>
      <Text>{campaign.discountExplanation}</Text>
    </SpaceBetween>
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
