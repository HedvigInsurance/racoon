import { NO_HOME } from './data/NO_HOME'
import { SE_ACCIDENT } from './data/SE_ACCIDENT'
import { SE_APARTMENT } from './data/SE_APARTMENT'
import { SE_HOUSE } from './data/SE_HOUSE'
import { SE_STUDENT_APARTMENT } from './data/SE_STUDENT_APARTMENT'
import { InputField } from './Field.types'
import { Form, FormSection, JSONData, Template } from './PriceForm.types'

const TEMPLATES: Record<string, Template | undefined> = {
  SE_HOUSE,
  SE_APARTMENT,
  SE_ACCIDENT,
  SE_STUDENT_APARTMENT,
  NO_HOME,
}

export const fetchPriceTemplate = (id: string) => {
  return TEMPLATES[id]
}

const convertTemplateIntoForm = (template: Template): Form => {
  return {
    sections: template.sections.map((section) => {
      return { ...section, state: 'initial' }
    }),
  }
}

type FillDataParams = { form: Form; data: JSONData; valueField: 'value' | 'defaultValue' }

export const prefillData = ({ form, data, valueField }: FillDataParams): Form => {
  return {
    ...form,
    sections: form.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        const dataValue = data[item.field.name]
        return {
          ...item,
          field: {
            ...item.field,
            [valueField]: dataValue ?? item.field[valueField],
          },
        }
      }),
    })),
  }
}

export const setupForm = (template: Template, userData: JSONData, suggestedData: JSONData) => {
  const form = convertTemplateIntoForm(template)

  const formWithDefaultValues = prefillData({
    form,
    data: suggestedData,
    valueField: 'defaultValue',
  })

  const formWithValues = prefillData({
    form: formWithDefaultValues,
    data: userData,
    valueField: 'value',
  })

  const formWithState = updateFormState(formWithValues)

  return formWithState
}

export const updateFormState = (form: Form): Form => {
  return {
    ...form,
    sections: form.sections.map(calculateSectionState),
  }
}

const calculateSectionState = (section: FormSection): FormSection => {
  const isCompleted = section.items.every((item) => {
    return !item.field.required || item.field.value !== undefined
  })

  return {
    ...section,
    state: isCompleted ? 'valid' : 'initial',
  }
}

export const deserializeField = (field: InputField, value: string) => {
  switch (field.type) {
    case 'text':
    case 'radio':
    case 'select':
    case 'date':
      return value

    case 'number':
      return parseInt(value, 10)

    default:
      return value
  }
}
