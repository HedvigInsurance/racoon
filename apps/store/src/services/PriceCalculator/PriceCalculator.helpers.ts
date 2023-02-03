import { ShopSessionCustomer } from '@/services/apollo/generated'
import { getShouldCollectEmail } from '@/utils/customer'
import { SE_ACCIDENT } from './data/SE_ACCIDENT'
import { SE_APARTMENT_BRF } from './data/SE_APARTMENT_BRF'
import { SE_APARTMENT_RENT } from './data/SE_APARTMENT_RENT'
import { SE_CAR } from './data/SE_CAR'
import { SE_HOUSE } from './data/SE_HOUSE'
import { SE_STUDENT_APARTMENT } from './data/SE_STUDENT_APARTMENT'
import { InputField } from './Field.types'
import { Form, FormSection, JSONData, Template } from './PriceCalculator.types'

const TEMPLATES: Record<string, Template | undefined> = {
  SE_HOUSE,
  SE_APARTMENT_RENT,
  SE_APARTMENT_BRF,
  SE_ACCIDENT,
  SE_STUDENT_APARTMENT,
  SE_CAR,
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

type SetupFormOptions = {
  customer: ShopSessionCustomer | null | undefined
  suggestedData: JSONData
  template: Template
  userData: JSONData
}
export const setupForm = ({ customer, suggestedData, template, userData }: SetupFormOptions) => {
  const form = convertTemplateIntoForm(template)
  form.sections.forEach((section) => {
    section.items = section.items.filter(
      (item) => item.field.name !== 'email' || getShouldCollectEmail(customer),
    )
  })

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

  return updateFormState(formWithValues)
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
