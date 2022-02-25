import type { BundledQuote } from './get-main-quote'
import type { InputField } from '../types'

const getIsStudentField = (quote: BundledQuote): InputField => {
  return {
    label: 'Are you a student?',
    type: 'radio',
    name: 'isStudent',
    options: [
      {
        label: 'Yes',
        value: 'YES',
        defaultChecked: quote.data.isStudent,
      },
      {
        label: 'No',
        value: 'NO',
        defaultChecked: !quote.data.isStudent,
      },
    ],
  }
}

const _calculateAge = (birthday: Date) => {
  var ageDifMs = Date.now() - birthday.getTime()
  var ageDate = new Date(ageDifMs) // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const isStudentElligible = (quote: BundledQuote) => {
  const birthDate = new Date(quote.data.birthDate)
  const age = _calculateAge(birthDate)
  const livingSpace = quote.data.livingSpace
  return age <= 30 && livingSpace <= 60
}

const getHouseholdSizeField = (quote: BundledQuote): InputField => {
  return {
    label: 'DETAILS_MODULE_TABLE_HOUSEHOLD_SIZE_CELL_LABEL',
    infoMessage: 'All ages, from 2-65 years',
    type: 'stepper',
    name: 'householdSize',
    min: 1,
    max: 6,
    step: 1,
    defaultValue: quote.data.numberCoInsured + 1,
  }
}

const getLivingSpaceField = (quote: BundledQuote): InputField => {
  return {
    label: 'DETAILS_MODULE_TABLE_LIVINGSPACE_CELL_LABEL_HOUSE',
    type: 'number',
    name: 'livingSpace',
    min: 6,
    max: 250,
    suffix: 'm²',
    defaultValue: quote.data.livingSpace,
  }
}

export const getQuickForm = (quote: BundledQuote): Array<InputField> => {
  const fields: Array<InputField> = []

  if (isStudentElligible(quote)) {
    fields.push(getIsStudentField(quote))
  }

  fields.push(getHouseholdSizeField(quote))

  return fields
}
