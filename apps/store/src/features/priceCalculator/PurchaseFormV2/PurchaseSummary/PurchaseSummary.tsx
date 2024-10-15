import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect } from 'react'
import { Text, Card, Divider, Button, yStack } from 'ui'
import type { Banner } from '@/components/Banner/Banner.types'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { useSetGlobalBanner, useDismissBanner } from '@/components/GlobalBanner/globalBannerState'
import { Pillow } from '@/components/Pillow/Pillow'
import { TotalPrice } from '@/components/ProductCard/TotalPrice/TotalPrice'
import { useResetPriceIntent } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { usePriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { useSelectedOfferValueOrThrow } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { TextWithLink } from '@/components/TextWithLink'
import {
  BUNDLE_DISCOUNT_PERCENTAGE,
  BUNDLE_DISCOUNT_PROMO_PAGE_PATH,
} from '@/features/bundleDiscount/bundleDiscount.constants'
import {
  hasBundleDiscount,
  hasCartItemsEligibleForBundleDiscount,
} from '@/features/bundleDiscount/bundleDiscount.utils'
import type { TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import { useShopSessionValueOrThrow } from '@/services/shopSession/ShopSessionContext'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { actions } from './PurchaseSummary.css'

export function PurchaseSummary({ className }: { className?: string }) {
  const { t } = useTranslation('purchase-form')
  const locale = useRoutingLocale()
  const offer = useSelectedOfferValueOrThrow()
  const priceTemplate = usePriceTemplate() as TemplateV2
  const resetPriceIntent = useResetPriceIntent()

  useNotifyAboutBundleDiscounts()

  const handleAddMore = useCallback(() => {
    resetPriceIntent()
  }, [resetPriceIntent])

  const showAddMoreButton = offer.product.multiple && priceTemplate.addMultiple

  return (
    <div className={clsx(yStack({ gap: 'xl' }), className)}>
      <Text size="xl">{t('ADDED_TO_CART_LABEL')}</Text>

      <Card.Root>
        <Card.Header>
          <Card.Media>
            <Pillow size="small" {...offer.product.pillowImage} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>{offer.product.displayNameFull}</Card.Title>
            <Card.Subtitle>{offer.exposure.displayNameShort}</Card.Subtitle>
          </Card.Heading>
        </Card.Header>
        <Divider />
        <TotalPrice label="Price" {...getOfferPrice(offer.cost)} />
      </Card.Root>

      <div className={actions}>
        {showAddMoreButton && (
          <Button onClick={handleAddMore} variant="secondary">
            {t('ADD_ANOTHER_INSURANCE_LABEL', { productName: offer.product.displayNameShort })}
          </Button>
        )}
        <ButtonNextLink href={PageLink.checkout({ locale })} variant="primary">
          {t('GO_TO_CART_LABEL')}
        </ButtonNextLink>
        <ButtonNextLink href={PageLink.store({ locale })} variant="ghost">
          {t('SEE_MORE_INSURANCES_LABEL')}
        </ButtonNextLink>
      </div>
    </div>
  )
}

function useNotifyAboutBundleDiscounts() {
  const { t } = useTranslation('purchase-form')
  const shopSession = useShopSessionValueOrThrow()
  const setGlobalBanner = useSetGlobalBanner()
  const dismissBanner = useDismissBanner()

  useEffect(() => {
    let banner: Banner | null = null
    if (hasBundleDiscount(shopSession)) {
      banner = {
        id: 'bundle-discount-applied',
        content: t('BUNDLE_DISCOUNT_CART_TOAST_SUMMARY', {
          percentage: BUNDLE_DISCOUNT_PERCENTAGE,
        }),
        variant: 'campaign',
      }
    } else if (hasCartItemsEligibleForBundleDiscount(shopSession)) {
      banner = {
        id: 'eligible-for-bundle-discount',
        content: (
          <TextWithLink as="span" size="xs" href={BUNDLE_DISCOUNT_PROMO_PAGE_PATH}>
            {t('BUNDLE_DISCOUNT_TEASER', {
              percentage: BUNDLE_DISCOUNT_PERCENTAGE,
            })}
          </TextWithLink>
        ),
        variant: 'campaign',
      }
    }

    if (banner) {
      setGlobalBanner(banner, { force: true })

      // We only want to show the bundle discount related banners at the "purchase summary" step
      // so I'm dismissing bundle discount banners when the user navigates away from this step
      return () => {
        dismissBanner(banner.id)
      }
    }
  }, [shopSession, t, setGlobalBanner, dismissBanner])
}
