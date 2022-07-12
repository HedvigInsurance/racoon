import { JSONSchemaType } from 'ajv'
import { FormTemplate, FormTemplateField, FormTemplateUISchema } from './FormTemplate.types'

type CombineParams = {
  schema: JSONSchemaType<Record<string, unknown>>
  uiSchema: FormTemplateUISchema
}

const shemaTypeToFieldType = (schemaType: string): FormTemplateField['type'] | null => {
  switch (schemaType) {
    case 'number':
      return 'number'
    case 'string':
      return 'text'
    default:
      return null
  }
}

export const combineFormTemplate = ({ schema, uiSchema }: CombineParams): FormTemplate => {
  return {
    sections: uiSchema.layout.sections.map((section) => {
      return {
        ...section,
        state: 'INITIAL',
        fields: section.fields.map<FormTemplateField>((field) => {
          const schemaField = schema.properties[field.name] as JSONSchemaType<unknown> | undefined
          const uiField = uiSchema.fields[field.name]

          const fieldType = shemaTypeToFieldType(schemaField?.type)
          // @ts-ignore
          const formField: FormTemplateField = { ...field, type: fieldType ?? 'text' }

          if (schemaField) {
            if (schemaField.title) formField.label = { key: schemaField.title }

            formField.required = schema.required.includes(field.name)

            // @ts-ignore we should be able to re-assign the type
            if (schemaField.minimum) formField.min = schemaField.minimum
            // @ts-ignore we should be able to re-assign the type
            if (schemaField.maximum) formField.max = schemaField.maximum

            if (schemaField.defaultValue) formField.defaultValue = schemaField.defaultValue

            if (schemaField.enum) {
              // @ts-ignore we should be able to re-assign the type
              formField.options = schemaField.enum.map((option: string) => ({
                value: option,
                label: option,
              }))
            }
          }

          if (uiField) {
            // @ts-ignore we should be able to re-assign the type
            formField.type = uiField.type ?? formField.type

            if (uiField.title) formField.label = uiField.title

            formField.required = uiField.required ?? formField.required ?? false

            if (uiField.defaultValue) formField.defaultValue = uiField.defaultValue

            if (uiField.options) {
              // @ts-ignore we should be able to re-assign the type
              formField.options = uiField.options
            }
          }

          return formField
        }),
      }
    }),
  }
}
