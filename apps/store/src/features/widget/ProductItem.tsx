import { datadogRum } from '@datadog/browser-rum'
import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import React, { useState, useMemo, type ReactNode } from 'react'
import { CrossIconSmall, InfoIcon, LockIcon, Text, theme } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductDetails } from '@/components/ProductItem/ProductDetails'
import { ProductDetailsHeader } from '@/components/ProductItem/ProductDetailsHeader'
import { useGetStartDateProps } from '@/components/ProductItem/useGetStartDateProps'
import { ProductTierSelector } from '@/components/ProductPage/PurchaseForm/ProductTierSelector'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { useStartDateUpdateMutation, type ProductOfferFragment } from '@/services/graphql/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'
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

const TODAY = new Date()

type Props = {
  shopSessionId: string
  selectedOffer: Offer
  tiers?: Array<Offer>
  deductibles?: Array<Offer>
  greenVariant?: boolean
  defaultExpanded?: boolean
  disableStartDate?: boolean
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
}

export const ProductItem = (props: Props) => {
  const { t } = useTranslation(['cart', 'purchase-form'])
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  const getStartDateProps = useGetStartDateProps()
  const { tooltip } = getStartDateProps({
    data: props.selectedOffer.priceIntentData,
    startDate: props.selectedOffer.startDate,
  })

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

  const [updateStartDate, { loading: updateStartDateLoading }] = useStartDateUpdateMutation()
  const handleChangeStartDate = (startDate: string) => {
    updateStartDate({
      variables: { productOfferIds: [props.selectedOffer.id], startDate },
    })
  }

  const [addToCart] = useAddToCart({
    shopSessionId: props.shopSessionId,
    entryToReplace: props.selectedOffer.id,
    onSuccess() {
      datadogRum.addAction('Widget | Changeed car tier level')
    },
  })
  const handleChangeTierLevel = (offerId: string) => addToCart(offerId)

  const handleClickHoverable = () => {
    setExpanded((prev) => !prev)
  }

  const handleClickTooltip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
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
            <SpaceFlex align="center" space={0.25}>
              <Text as="p" color="textTranslucentSecondary">
                {props.selectedOffer.exposure.displayNameShort}
              </Text>
              {!props.selectedOffer.cancellation.requested && (
                <Tooltip message={tooltip}>
                  <button onClick={handleClickTooltip}>
                    <InfoIcon color={theme.colors.textSecondary} />
                  </button>
                </Tooltip>
              )}
            </SpaceFlex>
          </div>
        </div>
      </div>

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
          onSelect={(date) => handleChangeStartDate(formatAPIDate(date))}
          fromDate={TODAY}
          disabled={props.disableStartDate}
          loading={updateStartDateLoading}
        />
      )}

      {props.tiers && props.tiers.length > 1 && (
        <ProductTierSelector
          offers={props.tiers}
          selectedOffer={props.selectedOffer}
          onValueChange={handleChangeTierLevel}
          defaultOpen={false}
        />
      )}

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
