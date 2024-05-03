import { datadogRum } from '@datadog/browser-rum'
import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import React, { useState, useMemo, type ReactNode } from 'react'
import { CrossIconSmall, LockIcon, Text, theme } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import * as Collapsible from '@/components/Collapsible'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductDetails } from '@/components/ProductItem/ProductDetails'
import { ProductDetailsHeader } from '@/components/ProductItem/ProductDetailsHeader'
import { useGetStartDateProps } from '@/components/ProductItem/useGetStartDateProps'
import { ProductTierSelector } from '@/components/ProductPage/PurchaseForm/ProductTierSelector'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { convertToDate } from '@/utils/date'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useAddToCart } from '@/utils/useAddToCart'
import {
  card,
  cardGreenVariant,
  cardHeader,
  cardHeaderRow,
  cardFooter,
  hoverable,
  deleteButton,
  fakeInput,
  fakeInputRow,
  details,
  detailsHeader,
} from './ProductItem.css'
import { type Offer } from './widget.types'

type Props = {
  shopSessionId: string
  selectedOffer: Offer
  tiers?: Array<Offer>
  deductibles?: Array<Offer>
  mode?: 'edit' | 'view'
  greenVariant?: boolean
  defaultExpanded?: boolean
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
}

export const ProductItem = (props: Props) => {
  const { mode = 'edit' } = props

  const { t } = useTranslation(['cart', 'purchase-form'])
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  const productDetails = useMemo(() => {
    const items = props.selectedOffer.displayItems.map((item) => ({
      title: item.displayTitle,
      value: item.displayValue,
    }))
    const tierLevelDisplayName = getTierLevelDisplayName(props.selectedOffer)
    if (tierLevelDisplayName) {
      items.push({ title: t('DATA_TABLE_TIER_LABEL'), value: tierLevelDisplayName })
    }
    const deductibleDisplayName = props.selectedOffer.deductible?.displayName
    if (deductibleDisplayName) {
      items.push({ title: t('DATA_TABLE_DEDUCTIBLE_LABEL'), value: deductibleDisplayName })
    }
    return items
  }, [props.selectedOffer, t])

  const productDocuments = props.selectedOffer.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const handleClickHoverable = () => {
    setExpanded((prev) => !prev)
  }

  const pillow = props.selectedOffer.product.pillowImage

  return (
    <div className={clsx(card, props.greenVariant && cardGreenVariant)}>
      <div className={hoverable} onClick={handleClickHoverable}>
        <div
          className={cardHeader}
          style={{ gridTemplateColumns: pillow.src ? 'auto 1fr' : '1fr' }}
        >
          <Pillow size="small" src={pillow.src} alt="" />
          <div>
            <div className={cardHeaderRow}>
              <Text as="p" size="md" color="textTranslucentPrimary">
                {props.selectedOffer.product.displayNameFull}
              </Text>

              {props.onDelete && (
                <button className={deleteButton} onClick={props.onDelete}>
                  <CrossIconSmall color={theme.colors.textSecondary} />
                </button>
              )}
            </div>
            <Text as="p" color="textTranslucentSecondary">
              {props.selectedOffer.exposure.displayNameShort}
            </Text>
          </div>
        </div>
      </div>

      {mode === 'edit' && (
        <EditUI
          shopSessionId={props.shopSessionId}
          selectedOffer={props.selectedOffer}
          tiers={props.tiers}
          deductibles={props.deductibles}
        />
      )}
      {mode === 'view' && <ViewUI selectedOffer={props.selectedOffer} />}

      <Collapsible.Root open={expanded} onOpenChange={setExpanded}>
        <Collapsible.Trigger asChild={true}>
          <ProductDetailsHeader
            className={detailsHeader}
            price={getOfferPrice(props.selectedOffer.cost)}
            expanded={expanded}
          />
        </Collapsible.Trigger>
        <Collapsible.Content style={{ cursor: 'initial' }}>
          <ProductDetails className={details} items={productDetails} documents={productDocuments} />
        </Collapsible.Content>
      </Collapsible.Root>

      {props.children && <div className={cardFooter}>{props.children}</div>}
    </div>
  )
}

function getTierLevelDisplayName(item: Pick<ProductOfferFragment, 'variant' | 'product'>) {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.product.displayNameFull
    ? item.variant.displayName
    : undefined
}

type EditUIProps = {
  shopSessionId: string
  selectedOffer: Offer
  tiers?: Array<Offer>
  deductibles?: Array<Offer>
}

function EditUI(props: EditUIProps) {
  const productOfferIds = useMemo(() => {
    const tiersOffersIds = props.tiers?.map((tier) => tier.id) ?? []
    const deductiblesOffersIds = props.deductibles?.map((deductible) => deductible.id) ?? []
    const offersIdsSet = new Set([
      props.selectedOffer.id,
      ...tiersOffersIds,
      ...deductiblesOffersIds,
    ])

    return Array.from(offersIdsSet)
  }, [props.selectedOffer.id, props.deductibles, props.tiers])

  const [addToCart] = useAddToCart({
    shopSessionId: props.shopSessionId,
    entryToReplace: props.selectedOffer.id,
    onSuccess() {
      datadogRum.addAction('Widget | Changed tier level')
    },
  })
  const handleChangeTierLevel = (offerId: string) => addToCart(offerId)

  return (
    <>
      <CancellationForm productOfferIds={productOfferIds} offer={props.selectedOffer} />

      {props.tiers && props.tiers.length > 1 && (
        <ProductTierSelector
          offers={props.tiers}
          selectedOffer={props.selectedOffer}
          onValueChange={handleChangeTierLevel}
          defaultOpen={false}
        />
      )}
    </>
  )
}

type ViewUIProps = {
  selectedOffer: Offer
}

function ViewUI(props: ViewUIProps) {
  const { t } = useTranslation(['cart', 'purchase-form'])
  const getStartDateProps = useGetStartDateProps()

  const { tooltip } = getStartDateProps({
    data: props.selectedOffer.priceIntentData,
    startDate: props.selectedOffer.startDate,
  })

  const handleClickTooltip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <>
      {props.selectedOffer.cancellation.requested ? (
        <div className={fakeInput}>
          <Text as="p" color="textTranslucentSecondary" size="xs">
            {t('purchase-form:START_DATE_FIELD_LABEL')}
          </Text>
          <div className={fakeInputRow}>
            <Text as="p" size="xl">
              {t('CART_ENTRY_AUTO_SWITCH')}
            </Text>

            <Tooltip message={tooltip}>
              <button onClick={handleClickTooltip}>
                <LockIcon size="1rem" color={theme.colors.textSecondary} />
              </button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <InputDay
          label={t('purchase-form:START_DATE_FIELD_LABEL')}
          selected={convertToDate(props.selectedOffer.startDate) ?? undefined}
          disabled={true}
        />
      )}
    </>
  )
}
