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
      <Ellipsis dangerouslySetInnerHTML={{ __html: banner.content }} />
    </Banner>
  )
}

const Ellipsis = styled.span({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  // GlobalBanner receives a HTML formatted string.
  // This is meant to style important text wrapped into <b> tags
  '& > b': {
    color: theme.colors.textPrimary,
  },
})

export default GlobalBanner
