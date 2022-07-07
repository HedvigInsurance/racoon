import { FormTemplate, FormSection } from '@/services/formTemplate/FormTemplate.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { PriceIntentService } from '@/services/priceIntent/PriceIntentService'

type FetchOrCreatePriceIntentParams = {
  service: PriceIntentService
  productId: string
}

export const fetchOrCreatePriceIntent = async ({
  service,
  productId,
}: FetchOrCreatePriceIntentParams) => {
  const existingForm = await service.fetchLatest()
  if (existingForm) return existingForm

  return service.create({ productId })
}

export const prepopulateFormTemplate = (
  template: FormTemplate,
  form: PriceIntent,
): FormTemplate => {
  return {
    sections: template.sections.map((section) => {
      const newSection: FormSection = {
        ...section,
        fields: section.fields.map((field) => ({
          ...field,
          defaultValue: form.data[field.name] ?? field.defaultValue ?? '',
        })),
        state: 'INITIAL',
      }

      const allRequiredFieldsAreValid = newSection.fields
        .filter((field) => field.required)
        .every((field) => form.data[field.name])

      if (allRequiredFieldsAreValid) newSection.state = 'VALID'

      return newSection
    }),
  }
}
