import { useTranslation } from 'next-i18next'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { Features } from '@/utils/Features'
import { isSameLink } from '@/utils/url'

type Props = {
  url: string
}

export const ProductGridItemBlockProductCTA = ({ url }: Props) => {
  const { t } = useTranslation('common')

  const products = useProductMetadata()
  const product = products?.find((product) => isSameLink(product.pageLink, url))
  if (product == null) {
    console.warn(`Did not find product for link ${url}, skipping CTA render!`)
    return
  }

  let priceLink: { pathname: string; query?: Record<string, string> }
  if (Features.enabled('PRICE_CALCULATOR_PAGE') && product.priceCalculatorPageLink) {
    priceLink = { pathname: product.priceCalculatorPageLink }
  } else {
    priceLink = {
      pathname: product.pageLink,
      query: { [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: '1' },
    }
  }

  return (
    <ButtonNextLink href={priceLink} size="medium" variant="primary-alt">
      {t('GET_PRICE_LINK')}
    </ButtonNextLink>
  )
}
