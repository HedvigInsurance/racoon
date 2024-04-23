'use client'
import type { ISbRichtext } from '@storyblok/react'
import { renderRichText } from '@storyblok/react'
import { useAtom, useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import type { ReusableBlockReferenceProps } from '@/blocks/ReusableBlockReference'
import type { BannerVariant } from '@/components/Banner/Banner.types'
import { globalBannerAtom } from '@/components/GlobalBanner/globalBannerState'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import type { ExpectedBlockType } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type Props = {
  blok: {
    announcement?: ExpectedBlockType<ReusableBlockReferenceProps>
  }
}

// Optimization - this effect should run in component without children to avoid rerenders
export function PageBannerTriggers({ blok }: Props) {
  useCampaignBanner()

  // Announcements are added as reusable blocks for Page and ProductPage content types
  const announcementBlocks = filterByBlockType(blok.announcement, 'reusableBlockReference')
  usePageAnnouncement(
    announcementBlocks.at(0)?.reference.content?.body[0] as AnnouncementBlok | undefined,
  )

  return null
}

export const useCampaignBanner = () => {
  const { t } = useTranslation()
  const { shopSession } = useShopSession()
  const setGlobalBanner = useSetAtom(globalBannerAtom)

  const campaign = shopSession?.cart.redeemedCampaign
  useEffect(() => {
    if (campaign) {
      setGlobalBanner({ id: 'campaign', content: t('GLOBAL_BANNER_CAMPAIGN'), variant: 'campaign' })
    }
  }, [campaign, setGlobalBanner, t])
}

type AnnouncementBlok = {
  id: string
  content: ISbRichtext
  variant?: BannerVariant
}

const usePageAnnouncement = (blok?: AnnouncementBlok) => {
  const [globalBanner, setGlobalBanner] = useAtom(globalBannerAtom)
  useEffect(() => {
    if (blok != null) {
      setGlobalBanner({
        id: blok.id,
        content: renderRichText(blok.content),
        variant: blok.variant ?? 'info',
      })
    }
  }, [blok, setGlobalBanner])
  // NOTE: Cleanup has to be separate effect, we need to check current banner to see if `setGlobalBanner` actually succeeded
  // It's possible that other banner was visible (ex. campaign announcement) and in this case we don't want to remove it
  const globalBannerId = globalBanner?.id
  useEffect(() => {
    return () => {
      if (globalBannerId != null && globalBannerId === blok?.id) {
        setGlobalBanner(null)
      }
    }
  }, [blok?.id, globalBannerId, setGlobalBanner])
}
