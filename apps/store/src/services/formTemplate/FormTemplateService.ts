import { JSONSchemaType } from 'ajv'
import { combineFormTemplate } from './combineFormTemplate'
import NO_HOME_CONTENT_SCHEMA from './data/NO_HOME_CONTENT.json'
import { NO_HOME_CONTENT_UI } from './data/NO_HOME_CONTENT_UI'
import SWEDISH_APARTMENT_SCHEMA from './data/SWEDISH_APARTMENT.json'
import { SWEDISH_APARTMENT_UI } from './data/SWEDISH_APARTMENT_UI'
import { FormTemplate, FormTemplateUISchema } from './FormTemplate.types'

type Schema = JSONSchemaType<Record<string, unknown>>

const SCHEMA: Record<string, Schema> = {
  SWEDISH_APARTMENT: SWEDISH_APARTMENT_SCHEMA as unknown as Schema,
  NO_HOME_CONTENT: NO_HOME_CONTENT_SCHEMA as unknown as Schema,
}
const UI_SCHEMA: Record<string, FormTemplateUISchema> = {
  SWEDISH_APARTMENT: SWEDISH_APARTMENT_UI,
  NO_HOME_CONTENT: NO_HOME_CONTENT_UI,
}

type FetchParams = {
  id: string
}

export class FormTemplateService {
  public async fetch({ id }: FetchParams): Promise<FormTemplate | null> {
    const schema = SCHEMA[id]
    const uiSchema = UI_SCHEMA[id]

    if (!schema || !uiSchema) return null

    return {
      id,
      ...combineFormTemplate({ schema, uiSchema }),
    }
  }
}
