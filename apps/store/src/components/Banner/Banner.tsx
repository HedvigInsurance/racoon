import { clsx } from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import { type ReactNode } from 'react'
import { InfoIcon, CampaignIcon, WarningTriangleIcon, CrossIconSmall, tokens } from 'ui'
import {
  bannerCloseButton,
  bannerContent,
  bannerIcon,
  bannerRoot,
} from '@/components/Banner/Banner.css'
import type { BannerVariant } from './Banner.types'

type Props = {
  children: ReactNode
  onClose: () => void
  variant?: BannerVariant
}

export const Banner = ({ children, onClose, variant = 'info' }: Props) => {
  return (
    <div className={clsx(bannerRoot.base, bannerRoot[variant])}>
      <div className={bannerContent}>
        <Icon variant={variant} className={bannerIcon} />
        {children}
      </div>
      <button className={bannerCloseButton} onClick={onClose}>
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
      icon = <InfoIcon color={tokens.colors.signalBlueElement} size={size} {...others} />
      break
    case 'campaign':
      icon = <CampaignIcon color={tokens.colors.signalGreenElement} size={size} {...others} />
      break
    case 'warning':
      icon = (
        <WarningTriangleIcon color={tokens.colors.signalAmberElement} size={size} {...others} />
      )
      break
    case 'error':
      icon = <WarningTriangleIcon color={tokens.colors.signalRedElement} size={size} {...others} />
      break
  }

  return icon
}
