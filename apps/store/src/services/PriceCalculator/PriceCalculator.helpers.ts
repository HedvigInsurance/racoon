import { ShopSessionCustomer } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { getShouldCollectEmail } from '@/utils/customer'
import { SE_ACCIDENT } from './data/SE_ACCIDENT'
import { SE_APARTMENT_BRF } from './data/SE_APARTMENT_BRF'
import { SE_APARTMENT_RENT } from './data/SE_APARTMENT_RENT'
import { SE_CAR } from './data/SE_CAR'
import { SE_HOUSE } from './data/SE_HOUSE'
import { SE_PET_CAT } from './data/SE_PET_CAT'
import { SE_PET_DOG } from './data/SE_PET_DOG'
import { SE_STUDENT_APARTMENT } from './data/SE_STUDENT_APARTMENT'
import { InputField, MIXED_BREED_OPTION_ID } from './Field.types'
import { Form, FormSection, JSONData, Template } from './PriceCalculator.types'

const TEMPLATES: Record<string, Template | undefined> = {
  SE_HOUSE,
  SE_APARTMENT_RENT,
  SE_APARTMENT_BRF,
  SE_ACCIDENT,
  SE_STUDENT_APARTMENT,
  SE_CAR,
  SE_PET_CAT,
  SE_PET_DOG,
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
  priceIntent: PriceIntent
  template: Template
}
export const setupForm = ({ customer, priceIntent, template }: SetupFormOptions) => {
  const form = convertTemplateIntoForm(template)
  form.sections.forEach((section) => {
    section.items = section.items.filter(
      (item) => item.field.name !== 'email' || getShouldCollectEmail(customer),
    )
  })

  const formWithDefaultValues = prefillData({
    form,
    data: { ...customer, ...priceIntent.suggestedData },
    valueField: 'defaultValue',
  })

  const formWithValues = prefillData({
    form: formWithDefaultValues,
    data: { ...customer, ...priceIntent.data },
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

export const deserializeField = (field: InputField, formData: FormData) => {
  switch (field.type) {
    case 'number':
      return parseNumber(field, formData)

    case 'pet-dog-breeds':
      return parseDogBreedsField(field, formData)

    case 'pet-cat-breeds':
      return parseCatBreedsField(field, formData)

    case 'text':
    case 'radio':
    case 'select':
    case 'date':
    default:
      return parseString(field, formData)
  }
}

const isFieldValueString = (value: FormDataEntryValue | null): value is string =>
  typeof value === 'string'

const getFieldDefaultValue = (field: InputField) => {
  if (field.value === undefined && field.defaultValue) {
    return field.defaultValue
  }
}

const parseString = (field: InputField, formData: FormData) => {
  const value = formData.get(field.name)

  if (isFieldValueString(value)) {
    return value
  }

  return getFieldDefaultValue(field)
}

const parseNumber = (field: InputField, formData: FormData) => {
  const value = formData.get(field.name)

  if (isFieldValueString(value)) {
    return parseInt(value, 10)
  }

  return getFieldDefaultValue(field)
}

const parseCatBreedsField = (field: InputField, formData: FormData) => {
  const values = formData.getAll(field.name)

  if (values.length > 0 && values.every(isFieldValueString)) {
    return values
  }

  return getFieldDefaultValue(field)
}

const parseDogBreedsField = (field: InputField, formData: FormData) => {
  const values = formData.getAll(field.name)

  if (values.length > 0 && values.every(isFieldValueString)) {
    // Removes 'Mixed Breed' option (in case it's present) before form submission
    return values.filter((breedId) => breedId !== MIXED_BREED_OPTION_ID)
  }

  return getFieldDefaultValue(field)
}
