import { isSameDay } from 'date-fns'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useMemo, useState, type ComponentProps, type ReactNode } from 'react'
import { Space, Text, Badge } from 'ui'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { convertToDate } from '@/utils/date'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AddToCartButton } from './AddToCartButton'
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
import { UpdateButton } from './UpdateButton'

const CO_INSURED_DATA_KEY = 'numberCoInsured'

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

  const [internalOffer, setInternalOffer] = useState(props.offer)
  const [startDate, setStartDate] = useState(() => getOfferStartDateWithFallback(internalOffer))
  const [numberCoInsured, setNumberCoInsured] = useState(() =>
    getOfferNumberCoInsuredWithFallback(internalOffer),
  )

  const resetForm = (offer: OfferRecommendationFragment) => {
    setInternalOffer(offer)
    setStartDate(getOfferStartDateWithFallback(offer))
    setNumberCoInsured(getOfferNumberCoInsuredWithFallback(offer))
  }

  const isFormPristine = useMemo(() => {
    const offerDate = getOfferStartDateWithFallback(internalOffer)
    const isStartDatePristine = isSameDay(offerDate, startDate)
    const offerNumberCoInsured = getOfferNumberCoInsuredWithFallback(internalOffer)
    const isNumberCoInsuredPristine = offerNumberCoInsured === numberCoInsured

    return isStartDatePristine && isNumberCoInsuredPristine
  }, [internalOffer, startDate, numberCoInsured])

  const price = getOfferPrice(internalOffer.cost)

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
              value={numberCoInsured}
              onChange={(value) => setNumberCoInsured(value)}
              optionLabel={(count) => t('NUMBER_COINSURED_OPTION_LABEL', { count })}
            />
            <InputDay
              className={startDateInput}
              label={t('START_DATE_LABEL')}
              fromDate={new Date()}
              selected={startDate}
              onSelect={(date) => setStartDate(date)}
            />
          </Space>

          <div className={priceWrapper}>
            <Text as="p" color="textTranslucentPrimary">
              {t('OFFER_PRICE_LABEL')}
            </Text>
            <Price
              {...price}
              color="textTranslucentPrimary"
              secondaryColor="textTranslucentSecondary"
            />
          </div>

          <div className={actionsWrapper}>
            <DismissButton variant="secondary" />
            {isFormPristine ? (
              <AddToCartButton
                shopSessionId={props.shopSessionId}
                offer={internalOffer}
                productName={props.productName}
              >
                {t('QUICK_ADD_BUTTON')}
              </AddToCartButton>
            ) : (
              <UpdateButton
                shopSessionId={props.shopSessionId}
                productName={props.productName}
                priceIntentData={internalOffer.priceIntentData}
                startDate={startDate}
                numberCoInsured={numberCoInsured}
                onUpdate={(offer) => resetForm(offer)}
              />
            )}
          </div>
        </Space>
      </Space>
    </div>
  )
}

function getOfferStartDateWithFallback(offer: OfferRecommendationFragment) {
  return convertToDate(offer.startDate) ?? new Date()
}

function getOfferNumberCoInsuredWithFallback(offer: OfferRecommendationFragment) {
  return parseInt(offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0
}
