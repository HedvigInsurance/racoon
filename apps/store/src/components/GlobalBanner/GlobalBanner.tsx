import styled from '@emotion/styled'
import { CampaignIcon, CrossIconSmall, Text, mq, theme } from 'ui'
import { useGlobalBanner } from './useGlobalBanner'

export const GlobalBanner = () => {
  const [value, setValue] = useGlobalBanner()

  if (value === null) return null

  return (
    <Wrapper>
      <GlobalBannerText color="textGreen" size="xs">
        <CampaignIcon color={theme.colors.greenElement} />
        {value}
      </GlobalBannerText>

      <Button onClick={() => setValue(null)}>
        <CrossIconSmall size="1rem" />
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  backgroundColor: theme.colors.green50,
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
