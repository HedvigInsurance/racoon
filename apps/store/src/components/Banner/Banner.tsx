import styled from '@emotion/styled'
import { type ReactNode } from 'react'
import { InfoIcon, CampaignIcon, WarningTriangleIcon, CrossIconSmall, mq, theme } from 'ui'
import { BannerVariant } from './Banner.types'

const Area = {
  Content: 'content',
  CloseBtn: 'close-btn',
}

type Props = {
  children: ReactNode
  handleClose: () => void
  variant?: BannerVariant
}

export const Banner = ({ children, handleClose, variant = 'info' }: Props) => {
  return (
    <Wrapper variant={variant}>
      <Content>
        <Icon variant={variant} />
        <Ellipsis>{children}</Ellipsis>
      </Content>
      <CloseButton onClick={handleClose}>
        <CrossIconSmall size="1rem" />
      </CloseButton>
    </Wrapper>
  )
}

const Icon = ({ variant }: { variant: BannerVariant }) => {
  const size = '1rem'

  let icon: ReactNode = null
  switch (variant) {
    case 'info':
      icon = <InfoIcon color={theme.colors.blue600} size={size} />
      break
    case 'campaign':
      icon = <CampaignIcon color={theme.colors.greenElement} size={size} />
      break
    case 'warning':
      icon = <WarningTriangleIcon color={theme.colors.amberElement} size={size} />
      break
    case 'error':
      icon = <WarningTriangleIcon color={theme.colors.redElement} size={size} />
      break
  }

  return icon
}

const Wrapper = styled.div<{ variant: BannerVariant }>(({ variant }) => ({
  display: 'grid',
  // Using grid here to perfect center align banner's content, excluding close button
  gridTemplateAreas: `
    ". ${Area.Content} ${Area.CloseBtn}"
  `,
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  paddingBlock: theme.space.sm,
  paddingInline: theme.space.md,
  fontSize: theme.fontSizes.xs,
  ...getVariantStyles(variant),

  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
}))

const Content = styled.div({
  gridArea: Area.Content,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  gap: theme.space.xs,
})

const CloseButton = styled.button({
  gridArea: Area.CloseBtn,
  justifySelf: 'end',
  color: theme.colors.textPrimary,
  paddingLeft: theme.space.xs,
  cursor: 'pointer',
})

const Ellipsis = styled.span({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const getVariantStyles = (variant: BannerVariant) => {
  switch (variant) {
    case 'info':
      return {
        color: theme.colors.blue800,
        backgroundColor: theme.colors.blueFill1,
      }
    case 'campaign':
      return {
        color: theme.colors.textGreen,
        backgroundColor: theme.colors.greenFill1,
      }
    case 'warning':
      return {
        color: theme.colors.textAmber,
        backgroundColor: theme.colors.amberFill1,
      }
    case 'error':
      return {
        color: theme.colors.textRed,
        backgroundColor: theme.colors.redFill1,
      }
    default:
      return {}
  }
}
