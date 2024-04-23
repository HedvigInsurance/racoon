import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useId, type ComponentProps, type ReactNode } from 'react'
import { Space, Text, Badge, Button } from 'ui'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AddToCartButton } from './AddToCartButton'
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
  productName: string
  subtitle: string
  pillow: ComponentProps<typeof Pillow>
  productPageLink: string
  badge?: string
  Body?: ReactNode
}

export function QuickAddEditableView(props: Props) {
  const { t } = useTranslation('cart')

  const formId = useId()
  const { state, handleChangeNumberCoInsured, handleChangeStartDate, handleSubmit } =
    useEditCrossSellOfferForm({
      shopSessionId: props.shopSessionId,
      productName: props.productName,
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
              <StepperInput
                className={formField}
                label={t('NUMBER_COINSURED_INPUT_LABEL')}
                min={0}
                max={5}
                optionLabel={(count) => t('NUMBER_COINSURED_OPTION_LABEL', { count })}
                value={state[Fields.NUMBER_CO_INSURED]}
                onChange={handleChangeNumberCoInsured}
              />
              <InputDay
                className={formField}
                label={t('START_DATE_LABEL')}
                fromDate={new Date()}
                selected={state[Fields.START_DATE]}
                onSelect={handleChangeStartDate}
              />
            </Space>
          </form>

          <div className={priceWrapper}>
            <Text as="p" color="textTranslucentPrimary">
              {t('OFFER_PRICE_LABEL')}
            </Text>
            <Price
              {...getOfferPrice(state.offer.cost)}
              color="textTranslucentPrimary"
              secondaryColor="textTranslucentSecondary"
            />
          </div>

          <div className={actionsWrapper}>
            <DismissButton variant="secondary" />
            {state.isPristine ? (
              <AddToCartButton
                shopSessionId={props.shopSessionId}
                offer={state.offer}
                productName={props.productName}
              >
                {t('QUICK_ADD_BUTTON')}
              </AddToCartButton>
            ) : (
              <Button
                type="submit"
                form={formId}
                size="medium"
                loading={state.status === 'submitting'}
              >
                {t('QUICK_ADD_UPDATE')}
              </Button>
            )}
          </div>
        </Space>
      </Space>
    </div>
  )
}
