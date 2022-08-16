import { ApolloClient } from '@apollo/client'
import { GetServerSidePropsContext } from 'next'
import { FormSection, FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { FormTemplateService } from '@/services/formTemplate/FormTemplateService'
import { priceIntentServiceInitServerSide } from '@/services/priceIntent/PriceIntent.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

type SetupPriceCalculatorFormParams = {
  shopSession: ShopSession
  apolloClient: ApolloClient<unknown>
  productId: string
  request: GetServerSidePropsContext['req']
  response: GetServerSidePropsContext['res']
}

export const setupPriceCalculatorForm = async ({
  shopSession,
  apolloClient,
  productId,
  request,
  response,
}: SetupPriceCalculatorFormParams) => {
  const priceIntentService = priceIntentServiceInitServerSide({
    req: request,
    res: response,
    shopSession,
    apolloClient,
  })
  const formTemplateService = new FormTemplateService()

  const [emptyTemplate, priceIntent] = await Promise.all([
    formTemplateService.fetch({ id: productId }),
    priceIntentService.fetch(productId),
  ])

  if (emptyTemplate === null) throw new Error(`No template found for productId: ${productId}`)

  const template = prepopulateFormTemplate(emptyTemplate, priceIntent.data)

  return { template, priceIntent }
}

const prepopulateFormTemplate = (
  template: FormTemplate,
  data: Record<string, unknown>,
): FormTemplate => {
  return {
    sections: template.sections.map((section) => {
      const newSection: FormSection = {
        ...section,
        fields: section.fields.map((field) => ({
          ...field,
          defaultValue: data[field.name] ?? field.defaultValue ?? '',
        })),
        state: 'INITIAL',
      }

      const allRequiredFieldsAreValid = newSection.fields
        .filter((field) => field.required)
        .every((field) => data[field.name])

      if (allRequiredFieldsAreValid) newSection.state = 'VALID'

      return newSection
    }),
  }
}
