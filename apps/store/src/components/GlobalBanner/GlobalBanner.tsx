import styled from '@emotion/styled'
import { Banner } from '@/components/Banner/Banner'
import { useDebugShopSession } from '@/utils/useDebugShopSession'
import { useGlobalBanner } from './useGlobalBanner'

export const GlobalBanner = () => {
  const { banner, dismissBanner } = useGlobalBanner()

  useDebugShopSession()

  const handleClose = () => {
    dismissBanner()
  }

  if (banner === null) return null

  return (
    <Banner variant={banner.variant} handleClose={handleClose}>
      <Ellipsis>{banner.content}</Ellipsis>
    </Banner>
  )
}

const Ellipsis = styled.span({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
