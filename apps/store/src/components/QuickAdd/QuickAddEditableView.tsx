import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { Space, Text, Badge, Button } from 'ui'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { DismissButton } from './DismissButton'
import {
  alignedBadge,
  card,
  cardHeader,
  link,
  formField,
  priceWrapper,
  actionsWrapper,
} from './QuickAddEditableView.css'
import { useEditCrossSellOfferForm, Fields } from './useEditCrossSellOfferForm'

type Props = {
  shopSessionId: string
  offer: OfferRecommendationFragment
  title: string
  subtitle: string
  pillow: ComponentProps<typeof Pillow>
  productPageLink: string
  badge?: string
  Body?: ReactNode
}

export function QuickAddEditableView(props: Props) {
  const { t } = useTranslation('cart')

  const formId = useId()
  const { offer, formState, handleSubmit, control } = useEditCrossSellOfferForm({
    shopSessionId: props.shopSessionId,
    initialOffer: props.offer,
  })

  return (
    <div className={card}>
      <Space y={1}>
        <div className={cardHeader}>
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
        </div>

        {props.Body}

        <Space y={1}>
          <form id={formId} onSubmit={handleSubmit}>
            <Space y={0.25}>
              <Controller
                name={Fields.NUMBER_CO_INSURED}
                control={control}
                render={({ field }) => (
                  <StepperInput
                    className={formField}
                    min={0}
                    max={5}
                    label={t('NUMBER_COINSURED_INPUT_LABEL')}
                    optionLabel={(count) => t('NUMBER_COINSURED_OPTION_LABEL', { count })}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name={Fields.START_DATE}
                control={control}
                render={({ field }) => (
                  <InputDay
                    className={formField}
                    label={t('START_DATE_LABEL')}
                    fromDate={new Date()}
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                  />
                )}
              />
            </Space>
          </form>

          <div className={priceWrapper}>
            <Text as="p" color="textTranslucentPrimary">
              {t('OFFER_PRICE_LABEL')}
            </Text>
            <Price
              {...getOfferPrice(offer.cost)}
              color="textTranslucentPrimary"
              secondaryColor="textTranslucentSecondary"
            />
          </div>

          <div className={actionsWrapper}>
            <DismissButton variant="secondary" />
            <Button type="submit" form={formId} size="medium" loading={formState.isSubmitting}>
              {formState.dirtyFields[Fields.NUMBER_CO_INSURED]
                ? t('QUICK_ADD_UPDATE')
                : t('QUICK_ADD_BUTTON')}
            </Button>
          </div>
        </Space>
      </Space>
    </div>
  )
}
