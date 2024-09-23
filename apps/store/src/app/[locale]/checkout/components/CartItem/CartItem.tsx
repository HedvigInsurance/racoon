import { useTranslation } from 'next-i18next'
import { type PropsWithChildren } from 'react'
import { Card, CrossIcon, IconButton, SupText, Text, sprinkles, yStack } from 'ui'
import { PDFViewer } from '@/components/PDFViewer'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { DetailsList } from '@/components/ProductCard/DetailsList/DetailsList'
import { Divider } from '@/components/ProductCard/Divider'
import { ProductCardDetails } from '@/components/ProductCard/ProductCardDetails'
import { useOfferDetails } from '@/components/ProductItem/useOfferDetails'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useFormatter } from '@/utils/useFormatter'
import { useIsEmbedded } from '@/utils/useIsEmbedded'
import { CartItemInsuranceSwitcher } from './components/CartItemInsuranceSwitcher'
import { EditCartItemDialog } from './components/EditCartItemDialog'
import { RemoveCartItemDialog } from './components/RemoveCartItemDialog'

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

  const isEmbedded = useIsEmbedded()

  if (!shopSession) {
    return null
  }

  const { product, exposure, variant, cancellation, startDate } = offer

  const productDocuments = variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

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
          <div>
            <Text className={sprinkles({ mb: 'xxs' })}>{t('VIEW_ENTRY_DETAILS_BUTTON')}</Text>

            <DetailsList.Root size="md">
              {productDetails.map(({ title, value }) => (
                <DetailsList.Item key={title}>
                  <DetailsList.Label>{title}</DetailsList.Label>
                  <DetailsList.Value>{value}</DetailsList.Value>
                </DetailsList.Item>
              ))}
            </DetailsList.Root>
          </div>

          <EditCartItemDialog offer={offer} />

          {productDocuments.length ? (
            <div>
              <Text>{t('DOCUMENTS_SECTION_LABEL')}</Text>
              <ul>
                {productDocuments.map(({ title, url }) => (
                  <li key={title}>
                    {isEmbedded ? (
                      <PDFViewer url={url}>
                        <button>
                          <Text as="span" color="textTranslucentSecondary">
                            {title}
                            <SupText>PDF</SupText>
                          </Text>
                        </button>
                      </PDFViewer>
                    ) : (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <Text as="span" color="textTranslucentSecondary">
                          {title}
                          <SupText>PDF</SupText>
                        </Text>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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
