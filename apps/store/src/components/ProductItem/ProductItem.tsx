import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import React, { type ComponentProps, useState, forwardRef, type ReactNode } from 'react'
import type { ButtonProps } from 'ui'
import { Badge, Button, Text, mq, theme } from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import { Pillow } from '@/components/Pillow/Pillow'
import { Skeleton } from '@/components/Skeleton'
import { ProductDetails } from './ProductDetails'
import { ProductDetailsHeader } from './ProductDetailsHeader'
import { StartDate } from './StartDate'

type Props = {
  title: string
  pillowSrc?: string
  startDate: ComponentProps<typeof StartDate>
  price: ComponentProps<typeof ProductDetailsHeader>['price']
  productDetails: ComponentProps<typeof ProductDetails>['items']
  productDocuments: ComponentProps<typeof ProductDetails>['documents']
  defaultExpanded?: boolean
  children?: ReactNode
  exposure?: string
  variant?: 'green'
  badge?: ComponentProps<typeof Badge>
}

export const ProductItem = (props: Props) => {
  const { t } = useTranslation('cart')
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  const handleClickHoverable = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <Card data-variant={props.variant}>
      <Hoverable onClick={handleClickHoverable} data-variant={props.variant}>
        <Header style={{ gridTemplateColumns: props.pillowSrc ? 'auto 1fr' : '1fr' }}>
          {props.pillowSrc && <Pillow size="small" src={props.pillowSrc} alt="" />}
          <div>
            <HeaderRow>
              <Text as="p" size="md" color="textTranslucentPrimary">
                {props.title}
              </Text>
              {props.badge && <AlignedBadge size="big" {...props.badge} />}
            </HeaderRow>
            <StartDate {...props.startDate} />
          </div>
        </Header>

        {props.exposure && (
          <Exposure>
            <span>{t('EXPOSURE_LABEL')}</span>
            <span>{props.exposure}</span>
          </Exposure>
        )}
      </Hoverable>

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
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: theme.colors.borderTranslucent2,
})

const HeaderRow = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

const AlignedBadge = styled(Badge)({
  position: 'absolute',
  right: 0,
})

const Exposure = styled.div({
  display: 'flex',
  gap: theme.space.sm,
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: theme.space.sm,
  fontSize: theme.fontSizes.md,
  color: theme.colors.textTranslucentSecondary,
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
