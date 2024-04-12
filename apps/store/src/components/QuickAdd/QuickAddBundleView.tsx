import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { type ReactNode, type ComponentProps, type PropsWithChildren } from 'react'
import { Badge, CheckIcon, Space, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  alignedBadge,
  card,
  divider,
  footer,
  link,
  pillow,
  pillowWrapper,
  priceWrapper,
  productDetail,
  productUsp,
} from './QuickAddBundleView.css'

type Props = {
  title: string
  subtitle: string
  primaryPillow: ComponentProps<typeof Pillow>
  secondaryPillow?: ComponentProps<typeof Pillow>
  price: ComponentProps<typeof Price>
  // TODO: evaluate if 'href' this is actually is agood addition design wise
  // or at least came up with a better name for it
  href: string
  badge?: ComponentProps<typeof Badge>
  Body: ReactNode
  Footer: ReactNode
}

export function QuickAddBundleView(props: Props) {
  const { t } = useTranslation('cart')

  return (
    <div className={card}>
      <Space y={1}>
        <SpaceFlex space={1} align="center">
          {props.secondaryPillow ? (
            <div className={pillowWrapper}>
              <Pillow className={pillow} size="mini" {...props.primaryPillow} />
              <Pillow className={pillow} size="mini" {...props.secondaryPillow} />
            </div>
          ) : (
            <Pillow className={pillow} size="small" {...props.primaryPillow} />
          )}

          <div>
            <Link className={link} href={props.href}>
              <Text as="span" color="textTranslucentPrimary">
                {props.title}
              </Text>
            </Link>
            <Text as="p" color="textTranslucentSecondary">
              {props.subtitle}
            </Text>
          </div>

          {props.badge && <Badge className={alignedBadge} color="blueFill3" {...props.badge} />}
        </SpaceFlex>

        <hr className={divider} />

        {props.Body}

        <div className={footer}>
          <div className={priceWrapper}>
            <Text as="p" color="textTranslucentPrimary">
              {t('OFFER_PRICE_LABEL')}
            </Text>
            <SpaceFlex space={0}>
              <Text color="textTranslucentPrimary">+</Text>
              <Price
                {...props.price}
                color="textTranslucentPrimary"
                secondaryColor="textTranslucentSecondary"
              />
            </SpaceFlex>
          </div>
          {props.Footer}
        </div>
      </Space>
    </div>
  )
}

type ProductDetailProps = {
  children: string | ReactNode
  value: string
}

export function ProductDetail(props: ProductDetailProps) {
  return (
    <li className={productDetail}>
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
    </li>
  )
}

export function ProductUsp({ children }: PropsWithChildren) {
  return (
    <li className={productUsp}>
      <Text color="textTranslucentSecondary">{children}</Text>
      <CheckIcon size="1rem" aria-label="Covered" />
    </li>
  )
}
