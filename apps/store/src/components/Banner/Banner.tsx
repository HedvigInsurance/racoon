import { clsx } from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import { type ReactNode } from 'react'
import { InfoIcon, CampaignIcon, WarningTriangleIcon, CrossIconSmall, theme } from 'ui'
import {
  bannerCloseButton,
  bannerContent,
  bannerIcon,
  bannerRoot,
} from '@/components/Banner/Banner.css'
import type { BannerVariant } from './Banner.types'

type Props = {
  children: ReactNode
  className?: string
  handleClose: () => void
  variant?: BannerVariant
}

export const Banner = ({ children, handleClose, variant = 'info', className }: Props) => {
  return (
    <div className={clsx(bannerRoot.base, bannerRoot[variant], className)}>
      <div className={bannerContent}>
        <Icon variant={variant} className={bannerIcon} />
        {children}
      </div>
      <button className={bannerCloseButton} onClick={handleClose}>
        <CrossIconSmall size="1rem" />
      </button>
    </div>
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
