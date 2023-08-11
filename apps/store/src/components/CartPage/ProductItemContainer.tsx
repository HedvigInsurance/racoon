import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { useGetStartDateProps } from '@/components/ProductItem/useGetStartDateProps'
import {
  ProductRecommendationsDocument,
  ShopSessionDocument,
  useCartEntryRemoveMutation,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { EditEntryButton } from '../CartInventory/CartEntryItem/EditEntryButton'
import { RemoveActionButton } from './RemoveActionButton'
import { useEditProductOffer } from './useEditProductOffer'

type CartEntry = ShopSession['cart']['entries'][number]

type Props = CartEntry & { shopSessionId: string }

export const ProductItemContainer = ({ shopSessionId, ...props }: Props) => {
  const { t } = useTranslation('cart')

  const [editProductOffer, editState] = useEditProductOffer()
  const handleConfirmEdit = () => {
    editProductOffer({
      shopSessionId,
      offerId: props.id,
      productName: props.variant.product.name,
      data: props.priceIntentData,
    })
  }

  const { showError } = useAppErrorHandleContext()
  const tracking = useTracking()
  const [removeProductOffer, removeState] = useCartEntryRemoveMutation({
    variables: { shopSessionId, offerId: props.id },
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
    awaitRefetchQueries: true,
    onCompleted(data) {
      const updatedShopSession = data.shopSessionCartEntriesRemove.shopSession
      if (updatedShopSession) {
        const offer = updatedShopSession.cart.entries.find((item) => item.id == props.id)
        if (offer) {
          tracking.reportDeleteFromCart(offer)
        } else {
          datadogLogs.logger.error('Failed to find offer being removed in session cart', {
            shopSessionId,
            offerId: props.id,
          })
        }
      }
    },
    onError: showError,
  })

  const hasDiscount = props.cost.discount.amount > 0
  const price = {
    currencyCode: props.cost.net.currencyCode,
    amount: props.cost.gross.amount,
    reducedAmount: hasDiscount ? props.cost.net.amount : undefined,
  }

  const getStartDateProps = useGetStartDateProps()
  const startDateProps = getStartDateProps({
    productName: props.variant.product.name,
    data: props.priceIntentData,
    startDate: (props.startDate as unknown as string | undefined) ?? undefined,
  })

  const tierLevelDisplayName = getTierLevelDisplayName(props)
  const productDetails = [
    ...props.displayItems.map((item) => ({
      title: item.displayTitle,
      value: item.displayValue,
    })),
    ...(tierLevelDisplayName
      ? [{ title: t('DATA_TABLE_TIER_LABEL'), value: tierLevelDisplayName }]
      : []),
    ...(props.deductible?.displayName
      ? [{ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: props.deductible.displayName }]
      : []),
  ]

  const productDocuments = props.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const title = props.variant.product.displayNameFull

  return (
    <ProductItem
      title={title}
      pillowSrc={props.variant.product.pillowImage.src}
      price={price}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
    >
      <EditEntryButton onConfirm={handleConfirmEdit} loading={editState === 'loading'} />
      <RemoveActionButton
        title={title}
        onConfirm={removeProductOffer}
        loading={removeState.loading}
      />
    </ProductItem>
  )
}

const getTierLevelDisplayName = (entry: CartEntry) => {
  // TODO: small hack, move logic to API
  return entry.variant.displayName !== entry.variant.product.displayNameFull
    ? entry.variant.displayName
    : undefined
}
