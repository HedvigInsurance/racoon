import styled from '@emotion/styled'
import { Text, InfoIcon, theme } from 'ui'

export const LatestAdoptionNote = ({ date }: { date: string }) => {
  const formattedDate = new Date(date).toLocaleString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Wrapper>
      <StyledInfoIcon color={theme.colors.blue600} />
      <Text as="p" size={{ _: 'xs', md: 'sm' }} color="textSecondary">
        Teckna innan{' '}
        <Text as="span" size={{ _: 'xs', md: 'sm' }} color="textPrimary">
          {formattedDate}
        </Text>{' '}
        så börjar försäkringen gälla när din nuvarande förfaller.
      </Text>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  gap: theme.space.xs,
  alignItems: 'baseline',
  backgroundColor: theme.colors.blue200,
  borderRadius: theme.radius.sm,
  padding: theme.space.md,
})

const StyledInfoIcon = styled(InfoIcon)({
  flex: '0 0 auto',
})
