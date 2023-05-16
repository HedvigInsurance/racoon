import styled from '@emotion/styled'
import { RESET } from 'jotai/utils'
import { CampaignIcon, CrossIconSmall, Text, mq, theme } from 'ui'
import { useGlobalBanner, useGlobalBannerClosed } from './useGlobalBanner'

export const GlobalBanner = () => {
  const [value, setValue] = useGlobalBanner()
  const [closed, setIsClosed] = useGlobalBannerClosed()

  const handleClose = () => {
    setValue(RESET)
    setIsClosed(true)
  }

  if (value === null || closed) return null

  return (
    <Wrapper>
      <GlobalBannerText color="textGreen" size="xs">
        <CampaignIcon color={theme.colors.greenElement} />
        {value}
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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  isolation: 'isolate',
})

const GlobalBannerText = styled(Text)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
})

const Button = styled.button({
  cursor: 'pointer',
  position: 'absolute',
  right: theme.space.md,

  [mq.lg]: {
    right: theme.space.xl,
  },
})
