import { Template } from '../PriceForm.types'

export const SE_STUDENT_APARTMENT: Template = {
  initialData: {
    isStudent: true,
  },
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
            type: 'radio',
            name: 'subType',
            label: { key: 'Ownership type' },
            options: [
              {
                label: { key: 'I rent' },
                value: 'RENT',
              },
              {
                label: { key: 'I own' },
                value: 'BRF',
              },
            ],
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
            minLength: 5,
            maxLength: 5,
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'livingSpace',
            label: { key: 'Apartment size' },
            required: true,
            min: 0,
          },
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
