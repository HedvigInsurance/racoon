import { JSONSchemaType } from 'ajv'
import {
  FormTemplate,
  FormTemplateField,
  FormTemplateUISchema,
  LayoutField,
} from './FormTemplate.types'

type CombineParams = {
  schema: JSONSchemaType<Record<string, unknown>>
  uiSchema: FormTemplateUISchema
}

const shemaTypeToFieldType = (schemaType: string): FormTemplateField['type'] | null => {
  switch (schemaType) {
    case 'number':
    case 'array':
      return schemaType
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
        fields: section.fields.map<FormTemplateField>((field) =>
          parseFormField({ field, schema, uiSchema }),
        ),
      }
    }),
  }
}

type Params = CombineParams & {
  field: LayoutField
}

const parseFormField = ({ field, schema, uiSchema }: Params) => {
  const schemaField = schema.properties[field.name] as JSONSchemaType<unknown> | undefined
  const fieldConfig = uiSchema.fields[field.name]

  const fieldType = shemaTypeToFieldType(schemaField?.type)

  // TODO: refactor this function to be more type safe
  // @ts-expect-error we fill in the rest of the fields later
  const formField: FormTemplateField = {
    ...field,
    type: fieldConfig?.type ?? fieldType ?? 'text',
  }

  const isOptionField = formField.type === 'select' || formField.type === 'radio'

  if (schemaField) {
    if (schemaField.title) formField.label = { key: schemaField.title }

    formField.required = schema.required.includes(field.name)

    if (formField.type === 'number') {
      if (schemaField.minimum) formField.min = schemaField.minimum
      if (schemaField.maximum) formField.max = schemaField.maximum
    }

    if (formField.type === 'text') {
      if (schemaField.minLength) formField.minLength = schemaField.minLength
      if (schemaField.maxLength) formField.maxLength = schemaField.maxLength
    }

    if (schemaField.defaultValue) formField.defaultValue = schemaField.defaultValue

    if (isOptionField && schemaField.enum) {
      formField.options = schemaField.enum.map((option: string) => ({
        value: option,
        label: option,
      }))
    }
  }

  if (fieldConfig) {
    if (fieldConfig.title) formField.label = fieldConfig.title

    formField.required = fieldConfig.required ?? formField.required ?? false

    if (fieldConfig.defaultValue) formField.defaultValue = fieldConfig.defaultValue

    if (isOptionField && fieldConfig.options) {
      formField.options = fieldConfig.options
    }

    if (formField.type === 'array') {
      formField.fields = formField.fields.map((layoutField) =>
        parseFormField({
          field: layoutField,
          schema,
          uiSchema,
        }),
      )
    }
  }

  return formField
}
