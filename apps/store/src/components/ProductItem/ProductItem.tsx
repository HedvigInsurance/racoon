import styled from '@emotion/styled'
import { type ComponentProps, useState, forwardRef, type ReactNode } from 'react'
import { Button, ButtonProps, Space, Text, mq, theme } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { Pillow } from '@/components/Pillow/Pillow'
import { Skeleton } from '@/components/Skeleton'
import { ProductDetails } from './ProductDetails'
import { ProductDetailsHeader } from './ProductDetailsHeader'
import { StartDate } from './StartDate'

type Props = {
  title: string
  pillowSrc: string
  startDate: ComponentProps<typeof StartDate>
  price: ComponentProps<typeof ProductDetailsHeader>['price']
  productDetails: ComponentProps<typeof ProductDetails>['items']
  productDocuments: ComponentProps<typeof ProductDetails>['documents']
  defaultExpanded?: boolean
  children?: ReactNode
  subtitle?: string
  Icon?: ReactNode
  variant?: 'green'
}

export const ProductItem = (props: Props) => {
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  const handleClickHoverable = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <Card data-variant={props.variant}>
      <Hoverable onClick={handleClickHoverable} data-variant={props.variant}>
        <Space y={1}>
          <Header>
            <Pillow size="small" src={props.pillowSrc} alt="" />
            <div>
              <HeaderRow>
                <Text as="p" size="md">
                  {props.title}
                </Text>
                {props.Icon}
              </HeaderRow>
              <StartDate {...props.startDate} />
            </div>
          </Header>

          {props.subtitle && (
            <Text as="p" size="md" color="textTranslucentSecondary">
              {props.subtitle}
            </Text>
          )}
        </Space>
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
  gridTemplateColumns: 'auto 1fr',
  columnGap: theme.space.md,
  alignItems: 'center',

  paddingBottom: theme.space.lg,
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: theme.colors.borderTranslucent2,
})

const HeaderRow = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  alignItems: 'center',
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
