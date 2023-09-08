import styled from '@emotion/styled'
import Link from 'next/link'
import { type ReactNode, type ComponentProps } from 'react'
import { Space, Text, mq, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  title: string
  subtitle: string
  pillow: ComponentProps<typeof Pillow>
  href: string
  cost?: ComponentProps<typeof Price>
  Body: ReactNode
  children: ReactNode
}

export const QuickAdd = (props: Props) => {
  return (
    <Card>
      <Space y={1}>
        <Header>
          <SpaceFlex space={1} align="center">
            <Pillow size="small" {...props.pillow} />
            <div>
              <StyledLink href={props.href}>
                <Text as="span" color="textTranslucentPrimary">
                  {props.title}
                </Text>
              </StyledLink>
              <Text as="p" color="textTranslucentSecondary">
                {props.subtitle}
              </Text>
            </div>
          </SpaceFlex>
        </Header>
        <Divider />
        {props.Body}
        <Footer>
          <SpaceFlex space={0.5}>{props.children}</SpaceFlex>

          {props.cost && (
            <Price
              {...props.cost}
              color="textTranslucentPrimary"
              secondaryColor="textTranslucentSecondary"
            />
          )}
        </Footer>
      </Space>
    </Card>
  )
}

const Card = styled.div({
  padding: theme.space.md,

  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.blueFill1,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.colors.borderTranslucent1,

  [mq.lg]: { padding: theme.space.lg },
})

const Header = styled.div({
  paddingBottom: theme.space.xs,
})

const StyledLink = styled(Link)({
  '&:hover': {
    textDecoration: 'underline',
  },
})

const Divider = styled.div({
  height: 1,
  backgroundColor: theme.colors.borderTranslucent1,
})

const Footer = styled.div({
  paddingTop: theme.space.xs,
  display: 'grid',
  gridTemplateRows: 'auto auto',
  gap: theme.space.md,

  [mq.sm]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

const StyledProductDetail = styled.li({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

type ProductDetailProps = {
  children: string | ReactNode
  value: string
}

export const ProductDetail = (props: ProductDetailProps) => {
  return (
    <StyledProductDetail>
      {typeof props.children === 'string' ? (
        <Text as="p" color="textSecondary">
          {props.children}
        </Text>
      ) : (
        props.children
      )}
      <Text as="p" color="textSecondary">
        {props.value}
      </Text>
    </StyledProductDetail>
  )
}
