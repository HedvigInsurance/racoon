import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { type ComponentProps, type ReactNode } from 'react'
import { Space, Text, Badge } from 'ui'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import { AddToCartButton, type AddToCartButtonProps } from './AddToCartButton'
import { DismissButton } from './DismissButton'
import {
  alignedBadge,
  card,
  link,
  stepperInput,
  startDateInput,
  priceWrapper,
  actionsWrapper,
} from './QuickAddEditableView.css'

type Props = {
  title: string
  subtitle: string
  pillow: ComponentProps<typeof Pillow>
  price: ComponentProps<typeof Price>
  productPageLink: string
  badge?: string
  Body?: ReactNode
} & Pick<AddToCartButtonProps, 'shopSessionId' | 'offer' | 'productName'>

export function QuickAddEditableView(props: Props) {
  const { t } = useTranslation('cart')

  return (
    <div className={card}>
      <Space y={1}>
        <SpaceFlex space={1} align="center">
          <Pillow size="small" {...props.pillow} />

          <div>
            <Link className={link} href={props.productPageLink}>
              <Text as="span" color="textTranslucentPrimary">
                {props.title}
              </Text>
            </Link>
            <Text as="p" color="textTranslucentSecondary">
              {props.subtitle}
            </Text>
          </div>

          {props.badge && (
            <Badge className={alignedBadge} color="pinkFill1">
              {props.badge}
            </Badge>
          )}
        </SpaceFlex>

        {props.Body}

        <Space y={1}>
          <Space y={0.25}>
            <StepperInput
              className={stepperInput}
              name="numberCoInsured"
              label={t('NUMBER_COINSURED_INPUT_LABEL')}
              min={0}
              max={5}
              defaultValue={0}
              optionLabel={(count) => t('NUMBER_COINSURED_OPTION_LABEL', { count })}
            />
            <InputDay
              className={startDateInput}
              name="startDate"
              label={t('START_DATE_LABEL')}
              fromDate={new Date()}
              defaultSelected={new Date()}
            />
          </Space>

          <div className={priceWrapper}>
            <Text as="p" color="textTranslucentPrimary">
              {t('OFFER_PRICE_LABEL')}
            </Text>
            <Price
              {...props.price}
              color="textTranslucentPrimary"
              secondaryColor="textTranslucentSecondary"
            />
          </div>

          <div className={actionsWrapper}>
            <DismissButton variant="secondary" />
            <AddToCartButton
              shopSessionId={props.shopSessionId}
              offer={props.offer}
              productName={props.productName}
            >
              {t('QUICK_ADD_BUTTON')}
            </AddToCartButton>
          </div>
        </Space>
      </Space>
    </div>
  )
}
