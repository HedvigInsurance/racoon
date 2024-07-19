import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { isBefore, isSameDay } from 'date-fns'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { useState, useId, type ComponentProps, type ReactNode, type FormEventHandler } from 'react'
import { z } from 'zod'
import { Text, Badge, Button, yStack } from 'ui'
import { InputDay } from '@/components/InputDay/InputDay'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import {
  useStartDateUpdateMutation,
  type OfferRecommendationFragment,
} from '@/services/graphql/generated'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { convertToDate, formatAPIDate } from '@/utils/date'
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
import { useAddRecommendationOfferToCart } from './useAddRecommendationOfferToCart'

enum Fields {
  NUMBER_CO_INSURED = 'numberCoInsured',
  START_DATE = 'startDate',
  INTENT = 'intent',
}

const FORM_SCHEMA = z.object({
  [Fields.NUMBER_CO_INSURED]: z.string().transform((value) => parseInt(value, 10)),
  [Fields.START_DATE]: z.string().transform((value) => new Date(value)),
  [Fields.INTENT]: z.enum(['add-offer', 'update-price']),
})

type FormInput = {
  [Fields.NUMBER_CO_INSURED]: number
  [Fields.START_DATE]: Date
  [Fields.INTENT]: 'add-offer' | 'update-price'
}

type Props = {
  shopSessionId: string
  initialOffer: OfferRecommendationFragment
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
  const [offer, setOffer] = useState(props.initialOffer)
  const [hasNumberCoInsuredChanged, setHasNumberCoInsuredChanged] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const getNewOffer = useGetNewOffer({
    shopSessionId: props.shopSessionId,
    productName: offer.product.name,
  })
  const updateOfferStartDate = useUpdateOfferStartDate()
  const [addOfferToCart] = useAddRecommendationOfferToCart({ shopSessionId: props.shopSessionId })

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    try {
      event.preventDefault()
      setSubmitting(true)

      const formData = new FormData(event.currentTarget)
      const formValues = getFormValues(formData)
      const hasStartDateChanged = !isSameDay(
        formValues[Fields.START_DATE],
        getOfferStartDateWithFallback(offer),
      )

      let updatedOffer = offer
      if (formValues[Fields.INTENT] === 'update-price') {
        updatedOffer = await getNewOffer({ numberCoInsured: formValues[Fields.NUMBER_CO_INSURED] })

        if (hasStartDateChanged) {
          updatedOffer = await updateOfferStartDate(updatedOffer.id, formValues[Fields.START_DATE])
        }

        setOffer(updatedOffer)
        setHasNumberCoInsuredChanged(false)
      } else {
        if (hasStartDateChanged) {
          updatedOffer = await updateOfferStartDate(offer.id, formValues[Fields.START_DATE])
        }

        await addOfferToCart(updatedOffer)
      }
    } catch (error) {
      datadogLogs.logger.error('Cross sell | failed to update offer', { error })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={card}>
      <div className={yStack({ gap: 'md' })}>
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

        <div className={yStack({ gap: 'md' })}>
          <form id={formId} onSubmit={handleSubmit}>
            <div className={yStack({ gap: 'xxs' })}>
              <StepperInput
                className={formField}
                name={Fields.NUMBER_CO_INSURED}
                min={0}
                max={5}
                label={t('NUMBER_COINSURED_INPUT_LABEL')}
                optionLabel={(count) => t('NUMBER_COINSURED_OPTION_LABEL', { count })}
                defaultValue={getOfferNumberCoInsuredWithFallback(offer)}
                onChange={(value) =>
                  setHasNumberCoInsuredChanged(value !== getOfferNumberCoInsuredWithFallback(offer))
                }
                required={true}
              />
              <InputDay
                className={formField}
                name={Fields.START_DATE}
                label={t('START_DATE_LABEL')}
                fromDate={new Date()}
                defaultSelected={getOfferStartDateWithFallback(offer)}
                required={true}
              />
            </div>
            <input
              type="hidden"
              name={Fields.INTENT}
              value={hasNumberCoInsuredChanged ? 'update-price' : 'add-offer'}
            />
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
            <Button type="submit" form={formId} size="medium" loading={submitting}>
              {hasNumberCoInsuredChanged ? t('QUICK_ADD_UPDATE') : t('QUICK_ADD_BUTTON')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getOfferStartDateWithFallback(offer: OfferRecommendationFragment) {
  const today = new Date()
  const offerStartDate = convertToDate(offer.startDate)
  if (offerStartDate === null || isBefore(offerStartDate, today)) return today

  return offerStartDate
}

function getOfferNumberCoInsuredWithFallback(offer: OfferRecommendationFragment) {
  const CO_INSURED_DATA_KEY = 'numberCoInsured'

  return parseInt(offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0
}

function getFormValues(formData: FormData): FormInput {
  const data = FORM_SCHEMA.parse(Object.fromEntries(formData.entries()))

  return data
}

type UseGetNewOfferParams = {
  shopSessionId: string
  productName: string
}

function useGetNewOffer({ shopSessionId, productName }: UseGetNewOfferParams) {
  const apolloClient = useApolloClient()

  const getNewOffer = async (
    data: Record<string, unknown>,
  ): Promise<OfferRecommendationFragment> => {
    const priceIntentService = priceIntentServiceInitClientSide(apolloClient)

    const priceTemplate = getPriceTemplate(productName)
    if (!priceTemplate) {
      throw new Error(`Cross sell | Price template not found for product ${productName}`)
    }

    const priceIntent = await priceIntentService.getOrCreate({
      shopSessionId,
      priceTemplate,
      productName,
    })

    const { offers } = await priceIntentService.upddateAndConfirm({
      priceIntentId: priceIntent.id,
      data: { ...priceIntent.suggestedData, ...data },
    })

    return offers[0] as OfferRecommendationFragment
  }

  return getNewOffer
}

function useUpdateOfferStartDate() {
  const [updateStartDate] = useStartDateUpdateMutation()

  const updateOfferStartDate = async (
    offerId: string,
    startDate: Date,
  ): Promise<OfferRecommendationFragment> => {
    const { data } = await updateStartDate({
      variables: {
        productOfferIds: [offerId],
        startDate: formatAPIDate(startDate),
      },
    })

    const updatedOffer = data?.productOffersStartDateUpdate.productOffers[0]
    if (!updatedOffer) {
      throw new Error(`Cross sell | failed to update offer (${offerId}) startDate (${startDate})`)
    }

    return updatedOffer
  }

  return updateOfferStartDate
}
