import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { type ComponentProps, useState, type ReactNode } from 'react'
import { Button, ButtonProps, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Collapsible } from './Collapsible'
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
          <div>
            <Text as="p" size="md">
              {props.title}
            </Text>
            <StartDate {...props.startDate} />
          </div>
        </Header>
      </Hoverable>

      <Collapsible
        open={expanded}
        onOpenChange={setExpanded}
        Trigger={<StyledProductDetailsHeader price={props.price} expanded={expanded} />}
      >
        <StyledProductDetails items={props.productDetails} documents={props.productDocuments} />
      </Collapsible>

      {props.children && <Footer>{props.children}</Footer>}
    </Card>
  )
}

export const ActionButton = (props: ButtonProps) => {
  return <Button size="medium" variant="secondary-alt" {...props} />
}

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
  padding: theme.space.lg,
  paddingBottom: `calc(${theme.space.lg} - ${theme.space.md})`,
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

const StyledProductDetailsHeader = styled(ProductDetailsHeader)({
  paddingBlock: theme.space.md,
})
const StyledProductDetails = styled(ProductDetails)({
  paddingBottom: theme.space.md,
})

const Footer = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  columnGap: theme.space.xs,
  paddingBottom: theme.space.md,
})
