// This is a copy of @/components/ProductItem/ProductItem
// We will to merge this file with the original one

import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import React, { type ComponentProps, useState, forwardRef, type ReactNode } from 'react'
import type { ButtonProps} from 'ui';
import { Button, CrossIconSmall, InfoIcon, LockIcon, Space, Text, mq, theme } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { InputDate } from '@/components/InputDate/InputDate'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductDetails } from '@/components/ProductItem/ProductDetails'
import { ProductDetailsHeader } from '@/components/ProductItem/ProductDetailsHeader'
import { Skeleton } from '@/components/Skeleton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { Features } from '@/utils/Features'

const USE_DAY_PICKER = Features.enabled('DAY_PICKER')

type Props = {
  title: string
  pillowSrc: string
  price: ComponentProps<typeof ProductDetailsHeader>['price']
  productDetails: ComponentProps<typeof ProductDetails>['items']
  productDocuments: ComponentProps<typeof ProductDetails>['documents']
  defaultExpanded?: boolean
  children?: ReactNode
  exposure: string
  variant?: 'green'
  tooltip: string
  autoSwitch: boolean
  startDate?: string
  onChangeStartDate: (value: string) => void
  disableStartDate?: boolean
  loading: boolean
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const ProductItem = (props: Props) => {
  const { t } = useTranslation(['cart', 'purchase-form'])
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  const handleClickHoverable = () => {
    setExpanded((prev) => !prev)
  }

  const handleClickTooltip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleChangeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChangeStartDate(event.target.value)
  }

  const todayDate = new Date()
  const today = formatAPIDate(todayDate)

  return (
    <Card data-variant={props.variant}>
      <Hoverable onClick={handleClickHoverable} data-variant={props.variant}>
        <Space y={1}>
          <Header style={{ gridTemplateColumns: props.pillowSrc ? 'auto 1fr' : '1fr' }}>
            <Pillow size="small" src={props.pillowSrc} alt="" />
            <div>
              <HeaderRow>
                <Text as="p" size="md" color="textTranslucentPrimary">
                  {props.title}
                </Text>

                {props.onDelete && (
                  <DeleteButton onClick={props.onDelete}>
                    <CrossIconSmall color={theme.colors.textSecondary} />
                  </DeleteButton>
                )}
              </HeaderRow>
              <SpaceFlex align="center" space={0.25}>
                <Text as="p" color="textTranslucentSecondary">
                  {props.exposure}
                </Text>
                {!props.autoSwitch && (
                  <Tooltip message={props.tooltip}>
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
      {props.autoSwitch ? (
        <FakeInput>
          <Text as="p" color="textTranslucentSecondary" size="xs">
            {t('purchase-form:START_DATE_FIELD_LABEL')}
          </Text>
          <FakeInputRow>
            <Text as="p" size="xl">
              {t('CART_ENTRY_AUTO_SWITCH')}
            </Text>

            <Tooltip message={props.tooltip}>
              <button onClick={handleClickTooltip}>
                <LockIcon size="1rem" color={theme.colors.textSecondary} />
              </button>
            </Tooltip>
          </FakeInputRow>
        </FakeInput>
      ) : USE_DAY_PICKER ? (
        <InputDay
          label={t('purchase-form:START_DATE_FIELD_LABEL')}
          selected={convertToDate(props.startDate) ?? undefined}
          onSelect={(date) => props.onChangeStartDate(formatAPIDate(date))}
          fromDate={todayDate}
          disabled={props.disableStartDate}
          loading={props.loading}
        />
      ) : (
        <InputDate
          label={t('purchase-form:START_DATE_FIELD_LABEL')}
          value={props.startDate}
          backgroundColor="light"
          onChange={handleChangeStartDate}
          disabled={props.disableStartDate || props.loading}
          min={today}
        />
      )}

      <Collapsible.Root open={expanded} onOpenChange={setExpanded}>
        <Collapsible.Trigger asChild={true}>
          <StyledProductDetailsHeader price={props.price} expanded={expanded} />
        </Collapsible.Trigger>
        <Collapsible.Content style={{ cursor: 'initial' }}>
          <StyledProductDetails items={props.productDetails} documents={props.productDocuments} />
        </Collapsible.Content>
      </Collapsible.Root>

      {props.children && <Footer>{props.children}</Footer>}
    </Card>
  )
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
