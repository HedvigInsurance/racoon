import { useTranslation } from 'next-i18next'
import { type PropsWithChildren } from 'react'
import { Card, CrossIcon, IconButton, Text, Divider, yStack, Tooltip, xStack, InfoIcon } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { DetailsList } from '@/components/ProductCard/DetailsList/DetailsList'
import { ProductCardDetails } from '@/components/ProductCard/ProductCardDetails'
import { TotalPrice } from '@/components/ProductCard/TotalPrice/TotalPrice'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { convertToDate } from '@/utils/date'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useFormatter } from '@/utils/useFormatter'
import { CartItemProductDetails } from './components/CartItemProductDetails'
import { CartItemProductDocuments } from './components/CartItemProductDocuments'
import { EditCartItemDialog } from './components/EditCartItemDialog'
import { RemoveCartItemDialog } from './components/RemoveCartItemDialog'
import { useOfferDetails } from './hooks/useOfferDetails'

type Props = {
  offer: ProductOfferFragment
  defaultExpanded?: boolean
  readOnly?: boolean
}

export const CartItem = ({ offer, defaultExpanded, readOnly }: PropsWithChildren<Props>) => {
  const { t } = useTranslation(['cart', 'purchase-form', 'common'])

  const formatter = useFormatter()

  const { shopSession } = useShopSession()

  const price = getOfferPrice(offer.cost)

  const productDetails = useOfferDetails(offer)

  if (!shopSession) {
    return null
  }

  const { product, exposure, variant, cancellation, startDate: offerStartDate } = offer

  const startDate = convertToDate(offerStartDate)
  const formattedStartDate = startDate ? formatter.fromNow(startDate) : null

  const isAutoSwitch = cancellation.requested

  const startDateValue = isAutoSwitch ? t('CART_ENTRY_AUTO_SWITCH') : formattedStartDate

  return (
    <Card.Root>
      {readOnly ? null : (
        <RemoveCartItemDialog.Root shopSessionId={shopSession.id} offer={offer}>
          <Card.Aside>
            <RemoveCartItemDialog.Trigger>
              <IconButton variant="secondary">
                <CrossIcon />
              </IconButton>
            </RemoveCartItemDialog.Trigger>
          </Card.Aside>
        </RemoveCartItemDialog.Root>
      )}

      <Card.Header className={xStack({ alignItems: 'center' })}>
        <Card.Media>
          <Pillow
            size="small"
            alt={product.pillowImage.alt}
            role="presentation"
            src={product.pillowImage.src}
          />
        </Card.Media>

        <Card.Heading>
          <Card.Title variant={{ _: 'standard.16', sm: 'standard.18' }}>
            {product.displayNameFull}
          </Card.Title>
          <Card.Subtitle size={{ _: 'body', sm: 'md' }}>{exposure.displayNameShort}</Card.Subtitle>
        </Card.Heading>
      </Card.Header>

      <ProductCardDetails.Root defaultOpen={defaultExpanded}>
        <ProductCardDetails.Trigger>
          {(isOpen) => (isOpen ? t('HIDE_DETAILS_BUTTON_LABEL') : t('SHOW_DETAILS_BUTTON_LABEL'))}
        </ProductCardDetails.Trigger>

        <ProductCardDetails.Content className={yStack({ paddingBlock: 'md', gap: 'md' })}>
          <CartItemProductDetails details={productDetails} />

          {readOnly ? null : <EditCartItemDialog offer={offer} />}

          <CartItemProductDocuments documents={variant.documents} />
        </ProductCardDetails.Content>
      </ProductCardDetails.Root>

      <DetailsList.Root gap="sm">
        <DetailsList.Item>
          <DetailsList.Label>{variant.displayName}</DetailsList.Label>
          <DetailsList.Value>
            <Text as="span" size="xs">
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
              <Text as="span" size="xs">
                -
                {formatter.monthlyPrice({
                  currencyCode: price.currencyCode,
                  amount: offer.cost.discount.amount,
                })}
              </Text>
            </DetailsList.Value>
          </DetailsList.Item>
        ) : null}

        <DetailsList.Item>
          <DetailsList.Label>{t('START_DATE_LABEL')}</DetailsList.Label>
          <DetailsList.Value>
            <Tooltip.Root>
              <div className={xStack({ gap: 'xxs' })}>
                <Text as="span" size="xs">
                  {startDateValue}
                </Text>

                {isAutoSwitch ? (
                  <Tooltip.Trigger>
                    <InfoIcon />
                  </Tooltip.Trigger>
                ) : null}
              </div>
              <Tooltip.Content>{t('CART_ITEM_TOOLTIP_AUTO_SWITCH')}</Tooltip.Content>
            </Tooltip.Root>
          </DetailsList.Value>
        </DetailsList.Item>
      </DetailsList.Root>

      <Divider />

      <TotalPrice {...price} label={t('common:YOUR_PRICE')} />
    </Card.Root>
  )
}
