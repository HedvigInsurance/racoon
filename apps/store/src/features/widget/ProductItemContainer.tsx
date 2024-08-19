import { datadogRum } from '@datadog/browser-rum'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useMemo, type ComponentProps } from 'react'
import { Button, Space } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import { useSelectedTypeOfContractAtom } from '@/components/ProductData/ProductDataProvider'
import { ProductItem } from '@/components/ProductItemV2/ProductItem'
import type { Offer } from '@/components/ProductItemV2/ProductItem.types'
import { ComparisonTableModal } from '@/components/ProductPage/PurchaseForm/ComparisonTableModal'
import { DeductibleSelector } from '@/components/ProductPage/PurchaseForm/DeductibleSelector'
import { ProductTierSelector } from '@/components/ProductPage/PurchaseForm/ProductTierSelector'
import { useTiersAndDeductibles } from '@/components/ProductPage/PurchaseForm/useTiersAndDeductibles'
import { useAddToCart } from '@/utils/useAddToCart'
import { productItem, compareButtonWrapper } from './ProductItemContainer.css'

type Props = {
  shopSessionId: string
  offers: Array<Offer>
  selectedOffer: Offer
} & Pick<
  ComponentProps<typeof ProductItem>,
  'greenVariant' | 'onDelete' | 'onEdit' | 'defaultExpanded'
>

export function ProductItemContainer({
  shopSessionId,
  offers,
  selectedOffer,
  ...delegated
}: Props) {
  const { t } = useTranslation('purchase-form')
  const setSelectedTypeOfContract = useSetAtom(useSelectedTypeOfContractAtom())
  const { tiers, deductibles } = useTiersAndDeductibles({
    offers,
    selectedOffer,
  })
  const [addToCart] = useAddToCart({
    shopSessionId: shopSessionId,
    entryToReplace: selectedOffer.id,
    onSuccess(offerId) {
      datadogRum.addAction('Widget | Changed tier level')

      const selectedTier = tiers.find((tier) => tier.id === offerId)
      if (selectedTier) {
        setSelectedTypeOfContract(selectedTier.variant.typeOfContract)
      }
    },
  })

  const productOfferIds = useMemo(() => {
    const tiersOffersIds = tiers.map((tier) => tier.id)
    const deductiblesOffersIds = deductibles.map((deductible) => deductible.id)
    const offersIdsSet = new Set([selectedOffer.id, ...tiersOffersIds, ...deductiblesOffersIds])

    return Array.from(offersIdsSet)
  }, [selectedOffer.id, deductibles, tiers])

  const handleChangeTierLevel = (offerId: string) => addToCart(offerId)

  const isPetProduct = selectedOffer.product.name.includes('_PET_')
  const shouldShowDeductibles = isPetProduct && deductibles.length > 1

  return (
    <ProductItem className={productItem} selectedOffer={selectedOffer} {...delegated}>
      <Space y={0.25}>
        <CancellationForm productOfferIds={productOfferIds} offer={selectedOffer} />

        {tiers.length > 1 && (
          <ProductTierSelector
            offers={tiers}
            selectedOffer={selectedOffer}
            onValueChange={handleChangeTierLevel}
          >
            <div className={compareButtonWrapper}>
              <ComparisonTableModal tiers={tiers} selectedTierId={selectedOffer.id}>
                <Button size="medium" fullWidth={true}>
                  {t('COMPARE_COVERAGE_BUTTON')}
                </Button>
              </ComparisonTableModal>
            </div>
          </ProductTierSelector>
        )}

        {shouldShowDeductibles && (
          <DeductibleSelector
            offers={deductibles}
            selectedOffer={selectedOffer}
            onValueChange={handleChangeTierLevel}
          />
        )}
      </Space>
    </ProductItem>
  )
}
