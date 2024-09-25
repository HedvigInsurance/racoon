import { isBefore } from 'date-fns'
import { z } from 'zod'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { convertToDate } from '@/utils/date'
import { AccidentCrossSellFormFields } from './CrossSell.constants'

export function getOfferNumberCoInsuredWithFallback(offer: OfferRecommendationFragment) {
  const CO_INSURED_DATA_KEY = 'numberCoInsured'

  return parseInt(offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0
}

export function getOfferStartDateWithFallback(offer: OfferRecommendationFragment) {
  const today = new Date()
  const offerStartDate = convertToDate(offer.startDate)
  if (offerStartDate === null || isBefore(offerStartDate, today)) return today

  return offerStartDate
}

const FORM_SCHEMA = z.object({
  [AccidentCrossSellFormFields.NUMBER_CO_INSURED]: z
    .string()
    .transform((value) => parseInt(value, 10)),
  [AccidentCrossSellFormFields.START_DATE]: z.string().transform((value) => new Date(value)),
  [AccidentCrossSellFormFields.INTENT]: z.enum(['add-offer', 'update-price']),
})

type FormInput = {
  [AccidentCrossSellFormFields.NUMBER_CO_INSURED]: number
  [AccidentCrossSellFormFields.START_DATE]: Date
  [AccidentCrossSellFormFields.INTENT]: 'add-offer' | 'update-price'
}

export function getFormValues(formData: FormData): FormInput {
  const data = FORM_SCHEMA.parse(Object.fromEntries(formData.entries()))

  return data
}
