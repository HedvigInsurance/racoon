import styled from '@emotion/styled'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import type { PropsWithChildren } from 'react';
import { type ReactNode, type ComponentProps } from 'react'
import { Badge, CheckIcon, Space, Text, mq, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  title: string
  subtitle: string
  pillow: ComponentProps<typeof Pillow>
  mainOfferPillow?: ComponentProps<typeof Pillow>
  badge?: ComponentProps<typeof Badge>
  href: string
  price?: ComponentProps<typeof Price>
  Body: ReactNode
  children: ReactNode
}

export const QuickAddBundleView = (props: Props) => {
  const { t } = useTranslation('cart')
  return (
    <Card>
      <Space y={1}>
        <SpaceFlex space={1} align="center">
          {props.mainOfferPillow ? (
            <PillowWrapper>
              <Pillow size="mini" {...props.mainOfferPillow} />
              <Pillow size="mini" {...props.pillow} />
            </PillowWrapper>
          ) : (
            <Pillow size="small" {...props.pillow} />
          )}
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
          {props.badge && <AlignedBadge color="blueFill3" {...props.badge} />}
        </SpaceFlex>
        <Divider />
        {props.Body}
        <Footer>
          {props.price && (
            <PriceWrapper>
              <Text as="p" color="textTranslucentPrimary">
                {t('ACCIDENT_OFFER_PRICE_LABEL')}
              </Text>
              <SpaceFlex space={0}>
                <Text color="textTranslucentPrimary">+</Text>
                <Price
                  {...props.price}
                  color="textTranslucentPrimary"
                  secondaryColor="textTranslucentSecondary"
                />
              </SpaceFlex>
            </PriceWrapper>
          )}
          <Space y={0.5}>{props.children}</Space>
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

const StyledLink = styled(Link)({
  '&:hover': {
    textDecoration: 'underline',
  },
})

const PillowWrapper = styled.div({
  width: '3rem',
  height: '3rem',

  '& > *:last-of-type': {
    marginLeft: 'auto',
  },
})

const AlignedBadge = styled(Badge)({
  alignSelf: 'flex-start',
  marginLeft: 'auto',
})

const Divider = styled.div({
  height: 1,
  backgroundColor: theme.colors.borderTranslucent1,
})

const Footer = styled.div({
  paddingTop: theme.space.xs,
})

const PriceWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.space.lg,
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

const ProductUspItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: theme.space.xs,
  paddingBlock: theme.space.md,
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
  },
})

export const ProductUsp = ({ children }: PropsWithChildren) => {
  return (
    <ProductUspItem>
      <Text color="textTranslucentSecondary">{children}</Text>
      <CheckIcon size="1rem" aria-label="Covered" />
    </ProductUspItem>
  )
}
