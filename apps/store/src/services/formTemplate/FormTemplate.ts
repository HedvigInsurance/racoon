import { JSONSchemaType } from 'ajv'
import SWEDISH_APARTMENT_SCHEMA from './data/SWEDISH_APARTMENT.json'
import { SWEDISH_APARTMENT_UI } from './data/SWEDISH_APARTMENT_UI'
import { FormTemplate, Input, UISchema } from './FormTemplate.types'

type Schema = JSONSchemaType<Record<string, unknown>>

const SCHEMA: Record<string, Schema> = {
  SWEDISH_APARTMENT: SWEDISH_APARTMENT_SCHEMA as unknown as Schema,
}
const UI_SCHEMA: Record<string, UISchema> = { SWEDISH_APARTMENT: SWEDISH_APARTMENT_UI }

type FetchParams = {
  id: string
}

export class FormTemplateService {
  public async fetch({ id }: FetchParams): Promise<FormTemplate | null> {
    return combineFormTemplate({ schema: SCHEMA[id], uiSchema: UI_SCHEMA[id] })
  }
}

type CombineParams = {
  schema: JSONSchemaType<Record<string, unknown>>
  uiSchema: UISchema
}

const combineFormTemplate = ({ schema, uiSchema }: CombineParams): FormTemplate => {
  return {
    groups: uiSchema.layout.groups.map((group) => {
      return {
        id: group.id,
        title: group.title,
        cta: group.cta,
        state: 'INITIAL',
        inputs: group.items.map<Input>((item) => {
          const schemaField = schema.properties[item.field]
          const uiField = uiSchema.fields[item.field]

          return {
            name: item.field,
            type: uiField?.widget ?? schemaField.type,
            label: uiField?.title ?? { key: item.field },
            columnSpan: item.columnSpan,
            required: uiField?.required ?? schema.required.includes(item.field),
            min: schemaField?.minimum ?? null,
            max: schemaField?.maximum ?? null,
            defaultValue: uiField?.defaultValue ?? schemaField?.defaultValue ?? null,
            options:
              uiField?.options ??
              schemaField?.enum?.map((value: string) => ({ label: { key: value }, value })) ??
              null,
          }
        }),
      }
    }),
  }
}
