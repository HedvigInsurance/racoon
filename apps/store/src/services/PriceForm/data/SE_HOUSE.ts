import { Template } from '../PriceForm.types'

export const SE_HOUSE: Template = {
  sections: [
    {
      id: 'your-info',
      title: { key: 'Your info' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: {
            type: 'text',
            name: 'ssn',
            label: { key: 'Personal number' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
    {
      id: 'your-home',
      title: { key: 'Your home' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: {
            type: 'text',
            name: 'street',
            label: { key: 'Address' },
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'text',
            name: 'zipCode',
            label: { key: 'Postal code' },
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'extra-buildings',
            name: 'extraBuildings',
            label: { key: 'Extra buildings' },
            defaultValue: [],
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
