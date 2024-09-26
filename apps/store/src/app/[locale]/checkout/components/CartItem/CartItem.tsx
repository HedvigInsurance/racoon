import { useTranslation } from 'next-i18next'
import { type PropsWithChildren } from 'react'
import { Card, CrossIcon, Divider, IconButton, Text, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { DetailsList } from '@/components/ProductCard/DetailsList/DetailsList'
import { ProductCardDetails } from '@/components/ProductCard/ProductCardDetails'
import { TotalPrice } from '@/components/ProductCard/TotalPrice/TotalPrice'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { convertToDate } from '@/utils/date'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useFormatter } from '@/utils/useFormatter'
import { CartItemInsuranceSwitcher } from './components/CartItemInsuranceSwitcher'
import { CartItemProductDetails } from './components/CartItemProductDetails'
import { CartItemProductDocuments } from './components/CartItemProductDocuments'
import { EditCartItemDialog } from './components/EditCartItemDialog'
import { RemoveCartItemDialog } from './components/RemoveCartItemDialog'
import { useOfferDetails } from './hooks/useOfferDetails'

type Props = {
  offer: ProductOfferFragment
  defaultExpanded?: boolean
}

export const CartItem = ({ offer, defaultExpanded }: PropsWithChildren<Props>) => {
  const { t } = useTranslation(['cart', 'purchase-form'])

  const formatter = useFormatter()

  const { shopSession } = useShopSession()

  const price = getOfferPrice(offer.cost)

  const productDetails = useOfferDetails(offer)

  if (!shopSession) {
    return null
  }

  const { product, exposure, variant, cancellation, startDate } = offer

  const startDateValue = convertToDate(startDate)
  const formattedStartDate = startDateValue ? formatter.fromNow(startDateValue) : null

  // When having an external insurer we'll either automatically switch so start date is unknown at this moment
  // or we the date selector is showing
  const shouldShowStartDateDetail = formattedStartDate && !cancellation.externalInsurer

  return (
    <Card.Root>
      <RemoveCartItemDialog.Root shopSessionId={shopSession.id} offer={offer}>
        <Card.Aside>
          <RemoveCartItemDialog.Trigger>
            <IconButton variant="secondary">
              <CrossIcon />
            </IconButton>
          </RemoveCartItemDialog.Trigger>
        </Card.Aside>
      </RemoveCartItemDialog.Root>
      <Card.Header>
        <Card.Media>
          <Pillow
            size="small"
            alt={product.pillowImage.alt}
            role="presentation"
            src={product.pillowImage.src}
          />
        </Card.Media>

        <Card.Heading>
          <Card.Title>{product.displayNameFull}</Card.Title>
          <Card.Subtitle>{exposure.displayNameShort}</Card.Subtitle>
        </Card.Heading>
      </Card.Header>

      <ProductCardDetails.Root defaultOpen={defaultExpanded}>
        <ProductCardDetails.Trigger>
          {(isOpen) => (isOpen ? t('HIDE_DETAILS_BUTTON_LABEL') : t('SHOW_DETAILS_BUTTON_LABEL'))}
        </ProductCardDetails.Trigger>

        <ProductCardDetails.Content className={yStack({ paddingTop: 'md', gap: 'md' })}>
          <CartItemProductDetails details={productDetails} />
          <EditCartItemDialog offer={offer} />
          <CartItemProductDocuments documents={variant.documents} />
        </ProductCardDetails.Content>
      </ProductCardDetails.Root>

      <CartItemInsuranceSwitcher
        cancellation={cancellation}
        offerId={offer.id}
        startDate={startDate}
      />

      <DetailsList.Root>
        <DetailsList.Item>
          <DetailsList.Label>{variant.displayName}</DetailsList.Label>
          <DetailsList.Value>
            <Text as="span" size="md">
              {formatter.monthlyPrice({
                currencyCode: price.currencyCode,
                amount: offer.cost.gross.amount,
              })}
            </Text>
          </DetailsList.Value>
        </DetailsList.Item>

        {offer.cost.discount.amount ? (
          <DetailsList.Item>
            <DetailsList.Label>{t('purchase-form:OFFER_SUMMARY_DISCOUNT_LABEL')}</DetailsList.Label>
            <DetailsList.Value>
              <Text as="span" size="md">
                {formatter.monthlyPrice({
                  currencyCode: price.currencyCode,
                  amount: offer.cost.discount.amount,
                })}
              </Text>
            </DetailsList.Value>
          </DetailsList.Item>
        ) : null}

        {shouldShowStartDateDetail ? (
          <DetailsList.Item>
            <DetailsList.Label>{t('START_DATE_LABEL')}</DetailsList.Label>
            <DetailsList.Value>
              <Text as="span" size="md">
                {formattedStartDate}
              </Text>
            </DetailsList.Value>
          </DetailsList.Item>
        ) : null}
      </DetailsList.Root>

      <Divider />

      <TotalPrice {...price} />
    </Card.Root>
  )
}
