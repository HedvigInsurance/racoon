import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { Text, tokens, xStack, yStack } from 'ui'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useSelectedOfferValueOrThrow } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { CampaignDiscountType, type ProductOfferFragment } from '@/services/graphql/generated'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSessionValueOrThrow } from '@/services/shopSession/ShopSessionContext'
import type { Money } from '@/utils/formatter'
import { useFormatter } from '@/utils/useFormatter'

export function OfferPriceDetails() {
  const { t } = useTranslation(['purchase-form', 'cart'])
  const formatter = useFormatter()
  const selectedOffer = useSelectedOfferValueOrThrow()
  const shopSession = useShopSessionValueOrThrow()

  const productData = useProductData()

  let breakdown: ReactNode = null
  let total: ReactNode
  if (hasDiscountForOffer(shopSession, selectedOffer)) {
    // TODO: Do we want to show breakdown without addons? It repeats the summary without adding new info
    if (hasReducedPrice(selectedOffer)) {
      const hasTiers = productData.variants.length > 1
      breakdown = (
        <div className={yStack({ gap: 'xxs' })}>
          <PriceBreakdownItem value={selectedOffer.cost.gross}>
            {selectedOffer.product.displayNameFull}
            {hasTiers && (
              <Text
                as="span"
                color="textPrimary"
                size="xxs"
                style={{
                  paddingInline: tokens.space.xs,
                  paddingBlock: tokens.space.xxs,
                  borderRadius: tokens.radius.xxs,
                  backgroundColor: tokens.colors.pink300,
                }}
              >
                {selectedOffer.variant.displayNameSubtype}
              </Text>
            )}
          </PriceBreakdownItem>
          <PriceBreakdownItem
            value={{
              ...selectedOffer.cost.discount,
              amount: -selectedOffer.cost.discount.amount,
            }}
          >
            {t('OFFER_SUMMARY_DISCOUNT_LABEL')}
          </PriceBreakdownItem>
        </div>
      )
    }

    const redeemedCampaign = shopSession.cart.redeemedCampaign!
    let discountExplanation: ReactNode
    switch (redeemedCampaign.discount.type) {
      case CampaignDiscountType.MonthlyPercentage:
      case CampaignDiscountType.IndefinitePercentage:
        discountExplanation = `-${redeemedCampaign.discount.percentage}% ${t(
          'DISCOUNT_DURATION_EXPLANATION',
          {
            count: redeemedCampaign.discount.months,
            monthlyPrice: formatter.monthlyPrice(selectedOffer.cost.gross),
            // Avoid double escaping / in price.  Safe since we're not using dangerouslySetInnerHtml
            interpolation: { escapeValue: false },
            ns: 'cart',
          },
        )}`
        break
      case CampaignDiscountType.FreeMonths:
        discountExplanation = t('DISCOUNT_STATE_FREE_MONTHS', {
          count: redeemedCampaign.discount.months,
          ns: 'cart',
        })
    }

    total = (
      <div>
        <Text as="div" size="md" className={xStack({ justifyContent: 'flex-end' })}>
          {hasReducedPrice(selectedOffer) && (
            <Text as="span" size="md" color="textSecondary" strikethrough={true}>
              {formatter.monthlyPrice(selectedOffer.cost.gross)}
            </Text>
          )}
          {formatter.monthlyPrice(selectedOffer.cost.net)}
        </Text>
        {discountExplanation && (
          <Text as="div" color="textSecondary" size="xs">
            {discountExplanation}
          </Text>
        )}
      </div>
    )
  } else {
    total = <Text size="md">{formatter.monthlyPrice(selectedOffer.cost.net)}</Text>
  }
  return (
    <div className={yStack({ gap: 'md' })}>
      {breakdown && (
        <>
          {breakdown}
          <Separator />
        </>
      )}
      <Text as="div" size="md" className={xStack({ alignItems: 'flex-start' })}>
        {t('OFFER_SUMMARY_TOTAL_LABEL')}{' '}
        <div style={{ flexGrow: 1, textAlign: 'right' }}>{total}</div>
      </Text>
    </div>
  )
}

function PriceBreakdownItem({ children, value }: { children: ReactNode; value: Money }) {
  const formatter = useFormatter()
  return (
    <Text
      as="div"
      className={xStack({ gap: 'xxs', alignItems: 'center' })}
      size="xs"
      color="textSecondary"
    >
      {children}
      <Text as="span" size="xs" style={{ flexGrow: 1, textAlign: 'right' }}>
        {formatter.monthlyPrice(value)}
      </Text>
    </Text>
  )
}

function Separator() {
  return <hr style={{ height: '1px', backgroundColor: tokens.colors.borderTranslucent1 }} />
}

const hasDiscountForOffer = (shopSession: ShopSession, offer: ProductOfferFragment) => {
  if (shopSession.cart.redeemedCampaign == null) {
    return false
  }
  // Discount code may be not applicable
  switch (shopSession.cart.redeemedCampaign.discount.type) {
    case CampaignDiscountType.MonthlyPercentage:
    case CampaignDiscountType.IndefinitePercentage:
      return offer.cost.discount.amount > 0
    case CampaignDiscountType.FreeMonths:
      return true
    default:
      return false
  }
}
const hasReducedPrice = (offer: ProductOfferFragment) =>
  offer.cost.net.amount < offer.cost.gross.amount
