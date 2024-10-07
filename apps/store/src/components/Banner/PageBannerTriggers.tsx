'use client'
import { type StoryblokRichTextNode } from '@storyblok/richtext'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import type { ReusableBlockReferenceProps } from '@/blocks/ReusableBlockReference'
import { renderRichTextToString } from '@/blocks/RichTextBlock/richTextReactRenderer'
import type { BannerVariant } from '@/components/Banner/Banner.types'
import { useGlobalBanner, useSetGlobalBanner } from '@/components/GlobalBanner/globalBannerState'
import { hasBundleDiscount } from '@/features/bundleDiscount/bundleDiscount.utils'
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
  // Announcements are added as reusable blocks for Page, ProductPage and Widget content types
  const announcementBlocks = filterByBlockType(blok.announcement, 'reusableBlockReference')

  usePageBanner(
    announcementBlocks.at(0)?.reference.content?.body[0] as AnnouncementBlok | undefined,
  )

  return null
}

export const useCampaignBanner = () => {
  const { t } = useTranslation()
  const { shopSession } = useShopSession()
  const setGlobalBanner = useSetGlobalBanner()

  const showCampaignBanner = !!shopSession?.cart.redeemedCampaign && !hasBundleDiscount(shopSession)
  useEffect(() => {
    if (showCampaignBanner) {
      setGlobalBanner({ id: 'campaign', content: t('GLOBAL_BANNER_CAMPAIGN'), variant: 'campaign' })
    }
  }, [showCampaignBanner, setGlobalBanner, t])
}

type AnnouncementBlok = {
  id: string
  content: StoryblokRichTextNode
  variant?: BannerVariant
}

const usePageBanner = (blok?: AnnouncementBlok) => {
  const { t } = useTranslation()
  const { shopSession } = useShopSession()
  const [globalBanner, setGlobalBanner] = useGlobalBanner()
  const globalBannerId = globalBanner?.id

  const showCampaignBanner = !!shopSession?.cart.redeemedCampaign && !hasBundleDiscount(shopSession)
  useEffect(() => {
    if (blok != null) {
      setGlobalBanner({
        id: blok.id,
        content: renderRichTextToString(blok.content),
        variant: blok.variant ?? 'info',
      })
    }

    // Show campaign banner only if there is no page specific announcement
    if (showCampaignBanner && blok == null) {
      setGlobalBanner({ id: 'campaign', content: t('GLOBAL_BANNER_CAMPAIGN'), variant: 'campaign' })
    }

    return () => {
      // Make sure to remove campaign banner if navigating to a page with a page specific announcment
      if (blok?.id != null && globalBannerId === 'campaign') {
        setGlobalBanner(null)
      }
    }
  }, [blok, setGlobalBanner, showCampaignBanner, globalBannerId, t])

  // NOTE: Cleanup has to be separate effect, we need to check current banner to see if `setGlobalBanner` actually succeeded
  // It's possible that other banner was visible (ex. campaign announcement) and in this case we don't want to remove it
  useEffect(() => {
    return () => {
      if (globalBannerId != null && globalBannerId === blok?.id) {
        setGlobalBanner(null)
      }
    }
  }, [blok?.id, globalBannerId, setGlobalBanner])
}
