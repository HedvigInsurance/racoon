// This is a copy of @/components/ProductItem/ProductItem
// We will to merge this file with the original one

import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import React, { type ComponentProps, useState, forwardRef, type ReactNode } from 'react'
import { Button, ButtonProps, InfoIcon, Space, Text, mq, theme } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { InputDate } from '@/components/InputDate/InputDate'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductDetails } from '@/components/ProductItem/ProductDetails'
import { ProductDetailsHeader } from '@/components/ProductItem/ProductDetailsHeader'
import { Skeleton } from '@/components/Skeleton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Tooltip } from '@/components/Tooltip/Tooltip'

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
  startDate?: string
  onChangeStartDate: (value: string) => void
  loading: boolean
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
              </HeaderRow>
              <SpaceFlex align="center" space={0.25}>
                <Text as="p" color="textTranslucentSecondary">
                  {props.exposure}
                </Text>
                <Tooltip message={props.tooltip}>
                  <button onClick={handleClickTooltip}>
                    <InfoIcon color={theme.colors.textSecondary} />
                  </button>
                </Tooltip>
              </SpaceFlex>
            </div>
          </Header>
        </Space>
      </Hoverable>

      <InputDate
        label={t('purchase-form:START_DATE_FIELD_LABEL')}
        value={props.startDate}
        backgroundColor="light"
        onChange={handleChangeStartDate}
        disabled={props.loading}
      />

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

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <Button ref={ref} size="medium" variant="secondary-alt" {...props} />
})
ActionButton.displayName = 'ActionButton'

export const ProductItemSkeleton = styled(Skeleton)({ height: '13.5rem' })

const Card = styled.div({
  borderRadius: theme.radius.md,
  padding: theme.space.md,
  paddingBottom: 0,

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
