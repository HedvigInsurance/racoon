import { ApolloClient } from '@apollo/client'
import { JSONSchemaType } from 'ajv'
import { ProductDocument, ProductQuery, ProductQueryVariables } from '@/services/apollo/generated'
import { combineFormTemplate } from './combineFormTemplate'
import { NO_ACCIDENT_UI } from './data/NO_ACCIDENT_UI'
import { NO_HOME_CONTENT_UI } from './data/NO_HOME_CONTENT_UI'
import { NO_HOUSE_UI } from './data/NO_HOUSE_UI'
import { NO_TRAVEL_UI } from './data/NO_TRAVEL_UI'
import { SE_ACCIDENT_UI } from './data/SE_ACCIDENT_UI'
import { SE_HOUSE_UI } from './data/SE_HOUSE_UI'
import { SWEDISH_APARTMENT_UI } from './data/SWEDISH_APARTMENT_UI'
import { FormTemplate, FormTemplateUISchema } from './FormTemplate.types'

type Schema = JSONSchemaType<Record<string, unknown>>

const UI_SCHEMA: Record<string, FormTemplateUISchema> = {
  SWEDISH_APARTMENT: SWEDISH_APARTMENT_UI,
  SE_ACCIDENT: SE_ACCIDENT_UI,
  SE_HOUSE: SE_HOUSE_UI,
  NO_HOME_CONTENT: NO_HOME_CONTENT_UI,
  NO_HOUSE: NO_HOUSE_UI,
  NO_TRAVEL: NO_TRAVEL_UI,
  NO_ACCIDENT: NO_ACCIDENT_UI,
}

type FetchParams = {
  productName: string
  id: string
}

export class FormTemplateService {
  constructor(private readonly apolloClient: ApolloClient<unknown>) {}

  public async fetch({ id, productName }: FetchParams): Promise<FormTemplate | null> {
    const schema = await this.fetchSchema(productName)
    const uiSchema = UI_SCHEMA[id]

    if (!schema || !uiSchema) return null

    return {
      id,
      ...combineFormTemplate({ schema, uiSchema }),
    }
  }

  private async fetchSchema(productName: string) {
    try {
      const result = await this.apolloClient.query<ProductQuery, ProductQueryVariables>({
        query: ProductDocument,
        variables: { name: productName },
        fetchPolicy: 'no-cache',
      })
      return result.data.product ? (result.data.product.schema as Schema) : null
    } catch (error) {
      console.warn(`Unable to get product schema: ${productName}`)
      console.warn(error)
    }

    return null
  }
}
