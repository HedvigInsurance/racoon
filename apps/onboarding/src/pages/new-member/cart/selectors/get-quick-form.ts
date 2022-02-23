import type { BundledQuote } from './get-main-quote'
import { QuickFormProps } from '../components/quick-form'

export const getQuickForm = (quote: BundledQuote): QuickFormProps['fields'] => {
  return [
    {
      label: 'DETAILS_MODULE_TABLE_HOUSEHOLD_SIZE_CELL_LABEL',
      infoMessage: 'All ages, from 2-65 years',
      type: 'stepper',
      name: 'householdSize',
      min: 1,
      max: 6,
      step: 1,
      defaultValue: quote.data.numberCoInsured + 1,
    },
    {
      label: 'Are you a student?',
      type: 'radio',
      name: 'isStudent',
      options: [
        {
          label: 'Yes',
          value: 'YES',
          defaultChecked: quote.data.isStudent === true,
        },
        {
          label: 'No',
          value: 'NO',
          defaultChecked: quote.data.isStudent === false,
        },
      ],
    },
  ]
}
