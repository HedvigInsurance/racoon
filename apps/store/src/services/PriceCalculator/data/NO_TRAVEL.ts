import { Template } from '../PriceCalculator.types'

export const NO_TRAVEL: Template = {
  name: 'NO_TRAVEL',
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
            min: 0,
            max: 5,
            name: 'numberCoInsured',
            label: { key: 'Number of co-insured' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
  ],
}
