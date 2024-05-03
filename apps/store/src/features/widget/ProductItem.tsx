import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import React, { useState, useMemo, forwardRef, type ReactNode } from 'react'
import type { ButtonProps } from 'ui'
import { Button, CrossIconSmall, InfoIcon, LockIcon, Space, Text, mq, theme } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { InputDate } from '@/components/InputDate/InputDate'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductDetails } from '@/components/ProductItem/ProductDetails'
import { ProductDetailsHeader } from '@/components/ProductItem/ProductDetailsHeader'
import { useGetStartDateProps } from '@/components/ProductItem/useGetStartDateProps'
import { ProductTierSelector } from '@/components/ProductPage/PurchaseForm/ProductTierSelector'
import { Skeleton } from '@/components/Skeleton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { useStartDateUpdateMutation, type ProductOfferFragment } from '@/services/graphql/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { Features } from '@/utils/Features'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useAddToCart } from '@/utils/useAddToCart'
import { type Offer } from './widget.types'

const USE_DAY_PICKER = Features.enabled('DAY_PICKER')

const TODAY = new Date()

type Props = {
  shopSessionId: string
  selectedOffer: Offer
  tiers?: Array<Offer>
  deductibles?: Array<Offer>
  variant?: 'green'
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

  const today = formatAPIDate(TODAY)
  const pillow = props.selectedOffer.product.pillowImage

  return (
    <Card data-variant={props.variant}>
      <Hoverable onClick={handleClickHoverable} data-variant={props.variant}>
        <Space y={1}>
          <Header style={{ gridTemplateColumns: pillow.src ? 'auto 1fr' : '1fr' }}>
            <Pillow size="small" src={pillow.src} alt="" />
            <div>
              <HeaderRow>
                <Text as="p" size="md" color="textTranslucentPrimary">
                  {props.selectedOffer.product.displayNameFull}
                </Text>

                {props.onDelete && (
                  <DeleteButton onClick={props.onDelete}>
                    <CrossIconSmall color={theme.colors.textSecondary} />
                  </DeleteButton>
                )}
              </HeaderRow>
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
          </Header>
        </Space>
      </Hoverable>

      {/* eslint-disable-next-line no-nested-ternary */}
      {props.selectedOffer.cancellation.requested ? (
        <FakeInput>
          <Text as="p" color="textTranslucentSecondary" size="xs">
            {t('purchase-form:START_DATE_FIELD_LABEL')}
          </Text>
          <FakeInputRow>
            <Text as="p" size="xl">
              {t('CART_ENTRY_AUTO_SWITCH')}
            </Text>

            <Tooltip message={tooltip}>
              <button onClick={handleClickTooltip}>
                <LockIcon size="1rem" color={theme.colors.textSecondary} />
              </button>
            </Tooltip>
          </FakeInputRow>
        </FakeInput>
      ) : USE_DAY_PICKER ? (
        <InputDay
          label={t('purchase-form:START_DATE_FIELD_LABEL')}
          selected={convertToDate(props.selectedOffer.startDate) ?? undefined}
          onSelect={(date) => handleChangeStartDate(formatAPIDate(date))}
          fromDate={TODAY}
          disabled={props.disableStartDate}
          loading={updateStartDateLoading}
        />
      ) : (
        <InputDate
          label={t('purchase-form:START_DATE_FIELD_LABEL')}
          value={props.selectedOffer.startDate}
          backgroundColor="light"
          onChange={(event) => handleChangeStartDate(event.target.value)}
          disabled={props.disableStartDate || updateStartDateLoading}
          min={today}
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
          <StyledProductDetailsHeader
            price={getOfferPrice(props.selectedOffer.cost)}
            expanded={expanded}
          />
        </Collapsible.Trigger>
        <Collapsible.Content style={{ cursor: 'initial' }}>
          <StyledProductDetails items={productDetails} documents={productDocuments} />
        </Collapsible.Content>
      </Collapsible.Root>

      {props.children && <Footer>{props.children}</Footer>}
    </Card>
  )
}

const getTierLevelDisplayName = (item: Pick<ProductOfferFragment, 'variant' | 'product'>) => {
  // TODO: small hack, move logic to API
  return item.variant.displayName !== item.product.displayNameFull
    ? item.variant.displayName
    : undefined
}

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps<React.ElementType>>(
  (props, ref) => {
    return <Button ref={ref} size="medium" variant="secondary-alt" {...props} />
  },
)
ActionButton.displayName = 'ActionButton'

export const ProductItemSkeleton = styled(Skeleton)({ height: '13.5rem' })

const Card = styled.div({
  borderRadius: theme.radius.md,
  padding: theme.space.md,
  paddingBottom: 0,
  position: 'relative',

  backgroundColor: theme.colors.opaque1,
  ['&[data-variant="green"]']: { backgroundColor: theme.colors.signalGreenFill },

  [mq.lg]: {
    padding: theme.space.lg,
    paddingBottom: `calc(${theme.space.lg} - ${theme.space.md})`,
  },
})

const Hoverable = styled.div({
  '@media (hover: hover)': {
    cursor: 'pointer',

    [`${Card}:has(> &:hover)`]: {
      backgroundColor: theme.colors.grayTranslucent200,
      ['&[data-variant="green"]']: { backgroundColor: theme.colors.green200 },
    },
  },
})

const Header = styled.div({
  display: 'grid',
  columnGap: theme.space.md,
  alignItems: 'center',
  paddingBottom: theme.space.md,
})

const HeaderRow = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

const StyledProductDetailsHeader = styled(ProductDetailsHeader)({
  paddingBlock: theme.space.md,
})

const StyledProductDetails = styled(ProductDetails)({
  paddingBottom: theme.space.md,
})

const Footer = styled.div({
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: theme.space.xs,
  paddingBottom: theme.space.md,
})

const DeleteButton = styled.button({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  backgroundColor: theme.colors.grayTranslucent200,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: theme.colors.grayTranslucent300,
  },
})

const FakeInput = styled.div({
  position: 'relative',
  padding: theme.space.sm,
  backgroundColor: theme.colors.translucent1,
  borderRadius: theme.radius.sm,
  height: '4.5rem',
  width: '100%',
})

const FakeInputRow = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
