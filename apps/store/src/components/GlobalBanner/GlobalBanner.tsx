'use client'
import styled from '@emotion/styled'
import { useAtomValue, useSetAtom } from 'jotai'
import { theme } from 'ui'
import { Banner } from '@/components/Banner/Banner'
import {
  dismissedBannerIdAtom,
  globalBannerAtom,
} from '@/components/GlobalBanner/globalBannerState'
import { useDebugShopSessionId } from '@/utils/useDebugShopSessionId'

const GlobalBanner = () => {
  const globalBanner = useAtomValue(globalBannerAtom)
  const setDismissedBannerId = useSetAtom(dismissedBannerIdAtom)

  // Show standard banners if applicable
  useDebugShopSessionId()

  if (globalBanner == null) return null

  return (
    <Banner variant={globalBanner.variant} onClose={() => setDismissedBannerId(globalBanner.id)}>
      <Content dangerouslySetInnerHTML={{ __html: globalBanner.content }} />
    </Banner>
  )
}

// TODO: Move to default banner styles
const Content = styled.span({
  // GlobalBanner receives a HTML formatted string.
  // This is meant to style important text wrapped into <b> tags
  '& > b': {
    color: theme.colors.textPrimary,
  },
})

export default GlobalBanner
