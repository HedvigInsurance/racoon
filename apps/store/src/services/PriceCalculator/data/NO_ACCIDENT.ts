import { getIntegerField } from '../Field.helpers'
import { Template } from '../PriceCalculator.types'

export const NO_ACCIDENT: Template = {
  name: 'NO_ACCIDENT',
  initialData: {
    isStudent: false,
  },
  sections: [
    {
      id: 'your-info',
      title: { key: 'Your info' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: {
            type: 'date',
            name: 'birthDate',
            label: { key: 'Date of birth' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
        {
          field: {
            type: 'text',
            name: 'street',
            label: { key: 'Address' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
        {
          field: {
            type: 'text',
            name: 'zipCode',
            label: { key: 'Postal code' },
            minLength: 4,
            maxLength: 4,
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: getIntegerField({
            name: 'livingSpace',
            label: { key: 'Apartment size' },
            required: true,
            min: 0,
          }),
          layout: { columnSpan: 3 },
        },
      ],
    },
    {
      id: 'insured-people',
      title: { key: 'Insured people' },
      submitLabel: { key: 'Calculate price' },
      items: [
        {
          field: {
            type: 'number',
            name: 'numberCoInsured',
            label: { key: 'Household size' },
            min: 1,
            max: 6,
            required: true,
            defaultValue: 1,
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
  ],
}
