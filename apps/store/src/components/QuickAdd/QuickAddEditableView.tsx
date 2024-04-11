import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { isSameDay } from 'date-fns'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import {
  useMemo,
  useState,
  useId,
  type ComponentProps,
  type ReactNode,
  type FormEventHandler,
} from 'react'
import { Space, Text, Badge, Button } from 'ui'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import {
  useStartDateUpdateMutation,
  type OfferRecommendationFragment,
} from '@/services/graphql/generated'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { convertToDate, formatAPIDate } from '@/utils/date'
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
  const { state, offer, isFormPristine, fieldProps, handleSubmit } = useEditOfferForm({
    shopSessionId: props.shopSessionId,
    productName: props.productName,
    initialOffer: props.offer,
  })

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
          <form id={formId} onSubmit={handleSubmit}>
            <Space y={0.25}>
              <StepperInput
                className={stepperInput}
                label={t('NUMBER_COINSURED_INPUT_LABEL')}
                min={0}
                max={5}
                optionLabel={(count) => t('NUMBER_COINSURED_OPTION_LABEL', { count })}
                {...fieldProps[Field.NUMBER_CO_INSURED]}
              />
              <InputDay
                className={startDateInput}
                label={t('START_DATE_LABEL')}
                fromDate={new Date()}
                {...fieldProps[Field.START_DATE]}
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
            {isFormPristine ? (
              <AddToCartButton
                shopSessionId={props.shopSessionId}
                offer={offer}
                productName={props.productName}
              >
                {t('QUICK_ADD_BUTTON')}
              </AddToCartButton>
            ) : (
              <Button type="submit" form={formId} size="medium" loading={state === 'loading'}>
                {t('QUICK_ADD_UPDATE')}
              </Button>
            )}
          </div>
        </Space>
      </Space>
    </div>
  )
}

function getOfferStartDateWithFallback(offer: OfferRecommendationFragment) {
  const today = new Date()
  return convertToDate(offer.startDate) ?? today
}

function getOfferNumberCoInsuredWithFallback(offer: OfferRecommendationFragment) {
  const CO_INSURED_DATA_KEY = 'numberCoInsured'
  return parseInt(offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0
}

enum Field {
  NUMBER_CO_INSURED = 'numberCoInsured',
  START_DATE = 'startDate',
}

type Params = {
  shopSessionId: string
  productName: string
  initialOffer: OfferRecommendationFragment
}

function useEditOfferForm({ shopSessionId, productName, initialOffer }: Params) {
  const [updateStartDate] = useStartDateUpdateMutation()
  const apolloClient = useApolloClient()

  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [offer, setOffer] = useState(initialOffer)
  const [startDate, setStartDate] = useState(() => getOfferStartDateWithFallback(offer))
  const [numberCoInsured, setNumberCoInsured] = useState(() =>
    getOfferNumberCoInsuredWithFallback(offer),
  )
  const isFormPristine = useMemo(() => {
    return (
      isSameDay(startDate, getOfferStartDateWithFallback(offer)) &&
      numberCoInsured === getOfferNumberCoInsuredWithFallback(offer)
    )
  }, [offer, startDate, numberCoInsured])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setState('loading')

      const hasNumberCosInsuredChanged =
        numberCoInsured !== getOfferNumberCoInsuredWithFallback(offer)
      if (hasNumberCosInsuredChanged) {
        const priceIntentService = priceIntentServiceInitClientSide(apolloClient)

        const priceTemplate = getPriceTemplate(productName)
        if (!priceTemplate) {
          setState('error')
          datadogLogs.logger.error('Cross sell | Price template not found', {
            productName,
          })
          return
        }

        const priceIntent = await priceIntentService.getOrCreate({
          shopSessionId,
          priceTemplate,
          productName,
        })

        await priceIntentService.update({
          priceIntentId: priceIntent.id,
          data: {
            numberCoInsured,
            startDate: formatAPIDate(startDate),
          },
          customer: { shopSessionId },
        })
        const { offers } = await priceIntentService.confirm(priceIntent.id)

        const updatedOffer = offers[0]
        setOffer(updatedOffer)
        setState('idle')
        setStartDate(getOfferStartDateWithFallback(updatedOffer))
        setNumberCoInsured(getOfferNumberCoInsuredWithFallback(updatedOffer))
      } else {
        await updateStartDate({
          variables: {
            productOfferIds: [offer.id],
            startDate: formatAPIDate(startDate),
          },
          onCompleted: (data) => {
            const updatedOffer = data.productOffersStartDateUpdate.productOffers[0]
            setOffer(updatedOffer)
            setState('idle')
            setStartDate(getOfferStartDateWithFallback(updatedOffer))
            setNumberCoInsured(getOfferNumberCoInsuredWithFallback(updatedOffer))
          },
          onError: (error) => {
            datadogLogs.logger.error('Cross sell | failed to update offer startDate', { error })
            setState('error')
          },
        })
      }
    } catch (error) {
      datadogLogs.logger.error('Cross sell | failed to update offer', { error })
      setState('error')
    }
  }

  return {
    state,
    offer,
    isFormPristine,
    handleSubmit,
    fieldProps: {
      [Field.NUMBER_CO_INSURED]: {
        name: Field.NUMBER_CO_INSURED,
        value: numberCoInsured,
        onChange: setNumberCoInsured,
      },
      [Field.START_DATE]: {
        name: Field.START_DATE,
        selected: startDate,
        onSelect: setStartDate,
      },
    },
  }
}
