import { useTranslation } from 'next-i18next'
import { type PropsWithChildren } from 'react'
import { Card, CrossIcon, IconButton, Text, sprinkles, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { DetailsList } from '@/components/ProductCard/DetailsList/DetailsList'
import { Divider } from '@/components/ProductCard/Divider'
import { ProductCardDetails } from '@/components/ProductCard/ProductCardDetails'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
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

export const Cartitem = ({ offer, defaultExpanded }: PropsWithChildren<Props>) => {
  const { t } = useTranslation(['cart', 'purchase-form'])

  const formatter = useFormatter()

  const { shopSession } = useShopSession()

  const price = getOfferPrice(offer.cost)

  const productDetails = useOfferDetails(offer)

  if (!shopSession) {
    return null
  }

  const { product, exposure, variant, cancellation, startDate } = offer

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
      </DetailsList.Root>

      <Divider />

      <DetailsList.Root size="md">
        <DetailsList.Item className={sprinkles({ color: 'textPrimary' })}>
          <DetailsList.Label>{t('CHECKOUT_PRICE_TOTAL')}</DetailsList.Label>
          <DetailsList.Value>
            <Price className={sprinkles({ justifyContent: 'flex-end' })} {...price} />
          </DetailsList.Value>
        </DetailsList.Item>
      </DetailsList.Root>
    </Card.Root>
  )
}
