import { datadogRum } from '@datadog/browser-rum'
import { clsx } from 'clsx'
import { useTranslation } from 'next-i18next'
import React, { useState, useMemo } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { CrossIconSmall, LockIcon, Text, Button, Space, theme } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import Collapsible from '@/components/Collapsible/Collapsible'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { useSelectedTypeOfContract } from '@/components/ProductData/ProductDataProvider'
import { useGetStartDateProps } from '@/components/ProductItem/useGetStartDateProps'
import { ComparisonTableModal } from '@/components/ProductPage/PurchaseForm/ComparisonTableModal'
import { DeductibleSelector } from '@/components/ProductPage/PurchaseForm/DeductibleSelector'
import { ProductTierSelector } from '@/components/ProductPage/PurchaseForm/ProductTierSelector'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { type ProductOfferFragment } from '@/services/graphql/generated'
import { convertToDate } from '@/utils/date'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useAddToCart } from '@/utils/useAddToCart'
import { ProductDetails } from './ProductDetails'
import {
  card,
  cardGreenVariant,
  cardHeader,
  cardHeaderRow,
  priceSection,
  deleteButton,
  editButton,
  fakeInput,
  fakeInputRow,
  separator,
  compareButtonWrapper,
  cardEditVariant,
} from './ProductItem.css'
import { type Offer } from './widget.types'

const DETAILS_SECTION_ID = 'details-section'

type Props = {
  shopSessionId: string
  selectedOffer: Offer
  tiers?: Array<Offer>
  deductibles?: Array<Offer>
  mode?: 'edit' | 'view'
  greenVariant?: boolean
  defaultExpanded?: boolean
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onEdit?: () => void
}

export function ProductItem(props: Props) {
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

  const toggleExpandCard = () => {
    setExpanded((prev) => !prev)
  }

  const pillow = props.selectedOffer.product.pillowImage

  return (
    <div
      className={clsx(card, {
        [cardGreenVariant]: props.greenVariant,
        [cardEditVariant]: mode === 'edit',
      })}
    >
      <button
        className={cardHeader}
        style={{ gridTemplateColumns: pillow.src ? 'auto 1fr' : '1fr' }}
        onClick={toggleExpandCard}
        arial-expanded={expanded}
        aria-controls={DETAILS_SECTION_ID}
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
      </button>

      <Space y={1}>
        {mode === 'edit' && (
          <EditUI
            shopSessionId={props.shopSessionId}
            selectedOffer={props.selectedOffer}
            tiers={props.tiers}
            deductibles={props.deductibles}
          />
        )}
        {mode === 'view' && <ViewUI selectedOffer={props.selectedOffer} />}

        <Space y={1}>
          <div className={priceSection}>
            <Text as="span">{t('MONTHLY_PRICE_LABEL')}</Text>
            <Price {...getOfferPrice(props.selectedOffer.cost)} />
          </div>

          <Collapsible.Root id={DETAILS_SECTION_ID} open={expanded} onOpenChange={setExpanded}>
            <Collapsible.Content style={{ cursor: 'initial' }}>
              <hr className={separator} />

              <ProductDetails
                className={sprinkles({ py: 'md' })}
                items={productDetails}
                documents={productDocuments}
              />

              {mode === 'edit' && props.onEdit && (
                <Button
                  className={editButton}
                  variant="secondary"
                  size="medium"
                  fullWidth={true}
                  onClick={props.onEdit}
                >
                  {t('EDIT_INFORMATION_BUTTON_LABEL')}
                </Button>
              )}
            </Collapsible.Content>

            <Collapsible.Trigger asChild={true}>
              <Button variant="secondary" size="medium" fullWidth={true}>
                {expanded ? t('HIDE_DETAILS_BUTTON_LABEL') : t('SHOW_DETAILS_BUTTON_LABEL')}
              </Button>
            </Collapsible.Trigger>
          </Collapsible.Root>
        </Space>
      </Space>
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
  const { t } = useTranslation('purchase-form')
  const [, setSelectedTypeOfContract] = useSelectedTypeOfContract()

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
    onSuccess(offerId) {
      datadogRum.addAction('Widget | Changed tier level')

      const selectedTier = props.tiers?.find((tier) => tier.id === offerId)
      if (selectedTier) {
        setSelectedTypeOfContract(selectedTier.variant.typeOfContract)
      }
    },
  })

  const handleChangeTierLevel = (offerId: string) => addToCart(offerId)

  const isPetProduct = props.selectedOffer.product.name.includes('_PET_')
  const shouldShowDeductibles = isPetProduct && !!props.deductibles && props.deductibles.length > 1

  return (
    <Space y={0.25}>
      <CancellationForm productOfferIds={productOfferIds} offer={props.selectedOffer} />

      {props.tiers && props.tiers.length > 1 && (
        <ProductTierSelector
          offers={props.tiers}
          selectedOffer={props.selectedOffer}
          onValueChange={handleChangeTierLevel}
        >
          <div className={compareButtonWrapper}>
            <ComparisonTableModal tiers={props.tiers} selectedTierId={props.selectedOffer.id}>
              <Button size="medium" fullWidth={true}>
                {t('COMPARE_COVERAGE_BUTTON')}
              </Button>
            </ComparisonTableModal>
          </div>
        </ProductTierSelector>
      )}

      {shouldShowDeductibles && (
        <DeductibleSelector
          offers={props.deductibles ?? []}
          selectedOffer={props.selectedOffer}
          onValueChange={handleChangeTierLevel}
        />
      )}
    </Space>
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
