import { useTranslation } from 'next-i18next'
import { createContext, useContext, type PropsWithChildren } from 'react'
import { Card, CrossIcon, IconButton, Text, yStack, Tooltip, xStack, InfoIcon } from 'ui'
import { DetailsList } from '@/components/DetailsList/DetailsList'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductCardDetails } from '@/components/ProductCard/ProductCardDetails'
import { TotalPrice } from '@/components/TotalPrice/TotalPrice'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { convertToDate } from '@/utils/date'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useFormatter } from '@/utils/useFormatter'
import { EditCartItemDialog } from './components/EditCartItemDialog'
import { ProductDetails } from './components/ProductDetails'
import { ProductDocuments } from './components/ProductDocuments'
import { RemoveCartItemDialog } from './components/RemoveCartItemDialog'
import { useOfferDetails } from './useOfferDetails'

type ProductCardContextValue = {
  offer: ProductOfferFragment
}

const ProductCardContext = createContext<ProductCardContextValue | null>(null)

const useProductCard = () => {
  const context = useContext(ProductCardContext)

  if (!context) {
    throw new Error('Make sure this component is used inside ProductCard.Root')
  }

  return context
}

type RootProps = {
  offer: ProductOfferFragment
}
const ProductCardRoot = ({ offer, children }: PropsWithChildren<RootProps>) => {
  return (
    <ProductCardContext.Provider value={{ offer }}>
      <Card.Root>{children}</Card.Root>
    </ProductCardContext.Provider>
  )
}

const ProductCardHeader = () => {
  const {
    offer: { product, exposure },
  } = useProductCard()

  return (
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
  )
}

type ProductCardDetailsSectionProps = {
  defaultExpanded?: boolean
  isEditable?: boolean
}
const ProductCardDetailsSection = ({
  defaultExpanded,
  isEditable,
}: ProductCardDetailsSectionProps) => {
  const { t } = useTranslation('cart')

  const { offer } = useProductCard()

  const productDetails = useOfferDetails(offer)

  const { variant } = offer

  return (
    <ProductCardDetails.Root defaultOpen={defaultExpanded}>
      <ProductCardDetails.Trigger>
        {(isOpen) => (isOpen ? t('HIDE_DETAILS_BUTTON_LABEL') : t('SHOW_DETAILS_BUTTON_LABEL'))}
      </ProductCardDetails.Trigger>

      <ProductCardDetails.Content className={yStack({ paddingBlock: 'md', gap: 'md' })}>
        <ProductDetails details={productDetails} />

        {isEditable && <EditCartItemDialog offer={offer} />}

        <ProductDocuments documents={variant.documents} />
      </ProductCardDetails.Content>
    </ProductCardDetails.Root>
  )
}

const ProductCardBreakdown = () => {
  const { t } = useTranslation()

  const formatter = useFormatter()

  const {
    offer: { cost, variant, cancellation, startDate: offerStartDate },
  } = useProductCard()

  const price = getOfferPrice(cost)

  const startDate = convertToDate(offerStartDate)
  const formattedStartDate = startDate ? formatter.fromNow(startDate) : null

  const isAutoSwitch = cancellation.requested

  const startDateValue = isAutoSwitch
    ? t('CART_ENTRY_AUTO_SWITCH', { ns: 'cart' })
    : formattedStartDate

  return (
    <DetailsList.Root gap="sm">
      <DetailsList.Item>
        <DetailsList.Label>{variant.displayName}</DetailsList.Label>
        <DetailsList.Value>
          <Text as="span" size="xs">
            {formatter.monthlyPrice({
              currencyCode: price.currencyCode,
              amount: cost.gross.amount,
            })}
          </Text>
        </DetailsList.Value>
      </DetailsList.Item>

      {!!cost.discount.amount && (
        <DetailsList.Item>
          <DetailsList.Label>
            {t('OFFER_SUMMARY_DISCOUNT_LABEL', { ns: 'purchase-form' })}
          </DetailsList.Label>
          <DetailsList.Value>
            <Text as="span" size="xs">
              {formatter.monthlyPrice({
                currencyCode: price.currencyCode,
                amount: -cost.discount.amount,
              })}
            </Text>
          </DetailsList.Value>
        </DetailsList.Item>
      )}

      <DetailsList.Item>
        <DetailsList.Label>{t('START_DATE_LABEL', { ns: 'cart' })}</DetailsList.Label>
        <DetailsList.Value>
          <Tooltip.Root>
            <div className={xStack({ gap: 'xxs' })}>
              <Text as="span" size="xs">
                {startDateValue}
              </Text>

              {isAutoSwitch && (
                <Tooltip.Trigger>
                  <InfoIcon />
                </Tooltip.Trigger>
              )}
            </div>
            <Tooltip.Content>{t('CART_ITEM_TOOLTIP_AUTO_SWITCH', { ns: 'cart' })}</Tooltip.Content>
          </Tooltip.Root>
        </DetailsList.Value>
      </DetailsList.Item>
    </DetailsList.Root>
  )
}

const ProductCardTotalPrice = () => {
  const { t } = useTranslation('common')

  const {
    offer: { cost },
  } = useProductCard()

  const price = getOfferPrice(cost)

  return <TotalPrice {...price} label={t('YOUR_PRICE')} />
}

const ProductCardRemoveButton = () => {
  const { offer } = useProductCard()
  const { shopSession } = useShopSession()

  if (!shopSession) {
    return null
  }

  return (
    <RemoveCartItemDialog.Root shopSessionId={shopSession.id} offer={offer}>
      <Card.Aside>
        <RemoveCartItemDialog.Trigger>
          <IconButton variant="secondary">
            <CrossIcon />
          </IconButton>
        </RemoveCartItemDialog.Trigger>
      </Card.Aside>
    </RemoveCartItemDialog.Root>
  )
}

export const ProductCard = {
  Root: ProductCardRoot,
  Header: ProductCardHeader,
  Details: ProductCardDetailsSection,
  Breakdown: ProductCardBreakdown,
  TotalPrice: ProductCardTotalPrice,
  RemoveButton: ProductCardRemoveButton,
}
