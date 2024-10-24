import clsx from 'clsx'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { Text, Card, Divider, yStack } from 'ui'
import type { Banner } from '@/components/Banner/Banner.types'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { useSetGlobalBanner, useDismissBanner } from '@/components/GlobalBanner/globalBannerState'
import { Pillow } from '@/components/Pillow/Pillow'
import { usePriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { TextWithLink } from '@/components/TextWithLink'
import { TotalPrice } from '@/components/TotalPrice/TotalPrice'
import { BUNDLE_DISCOUNT_PERCENTAGE } from '@/features/bundleDiscount/bundleDiscount.constants'
import {
  hasBundleDiscount,
  hasCartItemsEligibleForBundleDiscount,
} from '@/features/bundleDiscount/bundleDiscount.utils'
import { priceCalculatorAddedOffer } from '@/features/priceCalculator/priceCalculatorAtoms'
import type { TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import { useShopSessionValueOrThrow } from '@/services/shopSession/ShopSessionContext'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { actions } from './PurchaseSummary.css'

export function PurchaseSummary({ className }: { className?: string }) {
  const { t } = useTranslation('purchase-form')
  const locale = useRoutingLocale()
  const [addedOffer, setAddedOffer] = useAtom(priceCalculatorAddedOffer)
  const priceTemplate = usePriceTemplate() as TemplateV2

  useNotifyAboutBundleDiscounts()

  if (!addedOffer) {
    return null
  }

  const handleAddMore = () => {
    // Price intent is reset whenever a product is added to the cart so the only thing
    // we need to do in order to add another product is to close the purchase summary
    setAddedOffer(null)
  }

  const showAddMoreButton = addedOffer.product.multiple && priceTemplate.addMultiple

  return (
    <div className={clsx(yStack({ gap: 'xl' }), className)}>
      <Text size="xl">{t('ADDED_TO_CART_LABEL')}</Text>

      <Card.Root>
        <Card.Header>
          <Card.Media>
            <Pillow size="small" {...addedOffer.product.pillowImage} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>{addedOffer.product.displayNameFull}</Card.Title>
            <Card.Subtitle>{addedOffer.exposure.displayNameShort}</Card.Subtitle>
          </Card.Heading>
        </Card.Header>
        <Divider />
        <TotalPrice label={t('YOUR_PRICE', { ns: 'common' })} {...getOfferPrice(addedOffer.cost)} />
      </Card.Root>

      <div className={actions}>
        {showAddMoreButton && (
          <Button onClick={handleAddMore} variant="secondary">
            {t('ADD_ANOTHER_INSURANCE_LABEL', {
              productName: addedOffer.product.displayNameShort.toLowerCase(),
            })}
          </Button>
        )}
        <ButtonNextLink href={PageLink.checkout({ locale }).toRelative()} variant="primary">
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
  const locale = useRoutingLocale()
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
          <TextWithLink as="span" size="xs" href={PageLink.bundleDiscount({ locale })}>
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
  }, [t, locale, shopSession, setGlobalBanner, dismissBanner])
}
