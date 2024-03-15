'use client'
import styled from '@emotion/styled'
import { theme } from 'ui'
import { Banner } from '@/components/Banner/Banner'
import { useDebugShopSession } from '@/utils/useDebugShopSession'
import { useGlobalBanner } from './useGlobalBanner'

const GlobalBanner = () => {
  const { banner, dismissBanner } = useGlobalBanner()

  useDebugShopSession()

  const handleClose = () => {
    dismissBanner()
  }

  if (banner === null) return null

  return (
    <Banner variant={banner.variant} handleClose={handleClose}>
      <Content dangerouslySetInnerHTML={{ __html: banner.content }} />
    </Banner>
  )
}

const Content = styled.span({
  // GlobalBanner receives a HTML formatted string.
  // This is meant to style important text wrapped into <b> tags
  '& > b': {
    color: theme.colors.textPrimary,
  },
})

export default GlobalBanner
