import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { theme, Text, InfoIcon } from 'ui'
import { useFormatter } from '@/utils/useFormatter'

export const SelfSwitcherBubble = ({ date }: { date: Date }) => {
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()

  const formattedDate = formatter.fromNow(date)
  return (
    <Wrapper>
      <StyledInfoIcon color={theme.colors.blue600} />
      <Text size="xs"> {t('SELF_SWICHER_MESSAGE', { date: formattedDate })}</Text>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  position: 'relative',
  backgroundColor: theme.colors.blueFill1,
  paddingBlock: theme.space.sm,
  paddingRight: theme.space.md,
  paddingLeft: '2.25rem',
  borderRadius: theme.radius.sm,
})

const StyledInfoIcon = styled(InfoIcon)({
  position: 'absolute',
  top: '0.875rem',
  left: theme.space.sm,
})
