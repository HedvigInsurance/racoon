import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Button, FullscreenDialog, visuallyHidden } from 'ui'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { SelectInsuranceGrid } from '@/components/SelectInsuranceGrid/SelectInsuranceGrid'
import { isSameLink } from '@/utils/url'
import { selectInsuranceGrid } from './ProductGridItem.css'

type Props = {
  url: string
}

export const ProductGridItemBlockCategoryCTA = ({ url }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const products = useProductMetadata()
  const { t } = useTranslation('common')

  const productsByCategory = (products ?? []).filter(
    (product) => product.categoryPageLink && isSameLink(product.categoryPageLink, url),
  )

  if (productsByCategory.length < 1) {
    console.warn(
      `[ProductGridItem]: No products category link ${url} were found. Skipping cta render!`,
    )
    return null
  }

  return (
    <FullscreenDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <FullscreenDialog.Trigger asChild>
        <Button variant="primary-alt" size="medium">
          {t('GET_PRICE_LINK')}
        </Button>
      </FullscreenDialog.Trigger>

      <FullscreenDialog.Modal>
        <FullscreenDialog.Title className={visuallyHidden}>
          {t('SELECT_INSURANCE')}
        </FullscreenDialog.Title>
        <SelectInsuranceGrid
          products={productsByCategory}
          heading={t('SELECT_INSURANCE')}
          className={selectInsuranceGrid}
        />
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
