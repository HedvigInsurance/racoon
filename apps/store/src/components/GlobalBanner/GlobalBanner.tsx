import styled from '@emotion/styled'
import { RESET } from 'jotai/utils'
import { CampaignIcon, CrossIconSmall, Text, mq, theme } from 'ui'
import { useDebugShopSession } from '@/utils/useDebugShopSession'
import { useGlobalBanner, useGlobalBannerClosed } from './useGlobalBanner'

export const GlobalBanner = () => {
  const [value, setValue] = useGlobalBanner()
  const [closed, setIsClosed] = useGlobalBannerClosed()

  useDebugShopSession()

  const handleClose = () => {
    setValue(RESET)
    setIsClosed(true)
  }

  if (value === null || closed) return null

  return (
    <Wrapper>
      <GlobalBannerText color="textGreen" size="xs">
        <CampaignIcon color={theme.colors.greenElement} />
        <Ellipsis>{value}</Ellipsis>
      </GlobalBannerText>

      <Button onClick={handleClose}>
        <CrossIconSmall size="1rem" />
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  backgroundColor: theme.colors.greenFill1,
  paddingBlock: theme.space.sm,
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xs,

  paddingInline: theme.space.md,
  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
})

const GlobalBannerText = styled(Text)({
  display: 'grid',
  alignItems: 'center',
  gridTemplateColumns: 'auto 1fr',
  gap: theme.space.xs,
  marginInline: 'auto',
})

const Ellipsis = styled.span({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const Button = styled.button({
  cursor: 'pointer',
})
