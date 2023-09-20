import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { type ComponentProps, useState, forwardRef, type ReactNode } from 'react'
import { Badge, Button, ButtonProps, Text, mq, theme } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { Pillow } from '@/components/Pillow/Pillow'
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
  badge?: string
}

export const ProductItem = (props: Props) => {
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false)

  const handleClickHoverable = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <Card>
      <Hoverable onClick={handleClickHoverable}>
        <Header>
          <Pillow size="small" src={props.pillowSrc} alt="" />
          <HeaderContent>
            <div>
              <Text as="p" size="md">
                {props.title}
              </Text>
              <StartDate {...props.startDate} />
            </div>
            {props.badge && (
              <DesktopOnlyBadge size="big" color="blueFill3">
                {props.badge}
              </DesktopOnlyBadge>
            )}
          </HeaderContent>
        </Header>
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

const pulsingAnimation = keyframes({
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
})

export const Skeleton = styled.div({
  backgroundColor: theme.colors.grayTranslucent100,
  borderRadius: theme.radius.sm,
  height: '13.5rem',
  animation: `${pulsingAnimation} 1.5s ease-in-out infinite`,
})

const Card = styled.div({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
  padding: theme.space.md,
  paddingBottom: 0,

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

const HeaderContent = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  columnGap: theme.space.md,
  alignItems: 'start',
})

const DesktopOnlyBadge = styled(Badge)({
  display: 'none',

  [mq.lg]: {
    display: 'block',
  },
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
