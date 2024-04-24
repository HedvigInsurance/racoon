import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { type ReactNode, type ComponentProps } from 'react'
import { Badge, Space, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  alignedBadge,
  card,
  link,
  pillow,
  pillowWrapper,
  priceWrapper,
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

          {props.badge && <Badge className={alignedBadge} color="pinkFill1" {...props.badge} />}
        </SpaceFlex>

        {props.Body}

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
      </Space>
    </div>
  )
}
