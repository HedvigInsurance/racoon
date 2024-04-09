import styled from '@emotion/styled'
import type { ComponentPropsWithoutRef} from 'react';
import { type ReactNode } from 'react'
import { InfoIcon, CampaignIcon, WarningTriangleIcon, CrossIconSmall, mq, theme } from 'ui'
import type { BannerVariant } from './Banner.types'

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
        <StyledIcon variant={variant} />
        {children}
      </Content>
      <CloseButton onClick={handleClose}>
        <CrossIconSmall size="1rem" />
      </CloseButton>
    </Wrapper>
  )
}

type IconProps = ComponentPropsWithoutRef<
  typeof InfoIcon | typeof CampaignIcon | typeof WarningTriangleIcon
> & { variant: BannerVariant }

const Icon = ({ variant, ...others }: IconProps) => {
  const size = '1rem'

  let icon: ReactNode = null
  switch (variant) {
    case 'info':
      icon = <InfoIcon color={theme.colors.blue600} size={size} {...others} />
      break
    case 'campaign':
      icon = <CampaignIcon color={theme.colors.signalGreenElement} size={size} {...others} />
      break
    case 'warning':
      icon = <WarningTriangleIcon color={theme.colors.signalAmberElement} size={size} {...others} />
      break
    case 'error':
      icon = <WarningTriangleIcon color={theme.colors.signalRedElement} size={size} {...others} />
      break
  }

  return icon
}

const StyledIcon = styled(Icon)({
  alignSelf: 'start',
  // Optical alignment
  marginTop: 1,
})

const Wrapper = styled.div<{ variant: BannerVariant }>(({ variant }) => ({
  minHeight: '3rem',
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

  borderBottom: `0.5px solid ${theme.colors.borderTranslucent1}`,
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
        backgroundColor: theme.colors.signalGreenFill,
      }
    case 'warning':
      return {
        color: theme.colors.textAmber,
        backgroundColor: theme.colors.signalAmberFill,
      }
    case 'error':
      return {
        color: theme.colors.textRed,
        backgroundColor: theme.colors.signalRedFill,
      }
    default:
      return {}
  }
}
