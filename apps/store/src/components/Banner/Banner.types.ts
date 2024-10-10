import type { ReactNode } from 'react'

export type Banner = {
  id: string
  content: NonNullable<ReactNode>
  variant: BannerVariant
}

export type BannerVariant = 'info' | 'campaign' | 'warning' | 'error'
