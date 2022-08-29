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

export const combineFormTemplate = ({
  schema,
  uiSchema,
}: CombineParams): Omit<FormTemplate, 'id'> => {
  return {
    sections: uiSchema.layout.sections.map((section) => {
      return {
        ...section,
        state: 'INITIAL',
        fields: section.fields.map<FormTemplateField>((field) => {
          const schemaField = schema.properties[field.name] as JSONSchemaType<unknown> | undefined
          const uiField = uiSchema.fields[field.name]

          const fieldType = shemaTypeToFieldType(schemaField?.type)

          // TODO: refactor this function to be more type safe
          // @ts-expect-error we fill in the rest of the fields later
          const formField: FormTemplateField = {
            ...field,
            type: uiField?.type ?? fieldType ?? 'text',
          }

          const isOptionField = formField.type === 'select' || formField.type === 'radio'

          if (schemaField) {
            if (schemaField.title) formField.label = { key: schemaField.title }

            formField.required = schema.required.includes(field.name)

            if (formField.type === 'number') {
              if (schemaField.minimum) formField.min = schemaField.minimum
              if (schemaField.maximum) formField.max = schemaField.maximum
            }

            if (schemaField.defaultValue) formField.defaultValue = schemaField.defaultValue

            if (isOptionField && schemaField.enum) {
              formField.options = schemaField.enum.map((option: string) => ({
                value: option,
                label: option,
              }))
            }
          }

          if (uiField) {
            if (uiField.title) formField.label = uiField.title

            formField.required = uiField.required ?? formField.required ?? false

            if (uiField.defaultValue) formField.defaultValue = uiField.defaultValue

            if (isOptionField && uiField.options) {
              formField.options = uiField.options
            }
          }

          return formField
        }),
      }
    }),
  }
}
