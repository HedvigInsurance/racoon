import { UISchema } from '../FormTemplate.types'

export const SWEDISH_APARTMENT_UI: UISchema = {
  layout: {
    groups: [
      {
        id: 'autofill',
        title: { key: 'Your info' },
        items: [
          { field: 'isMover', columnSpan: 6 },
          { field: 'personalNumber', columnSpan: 6 },
        ],
        cta: { key: 'Next step' },
      },
      {
        id: 'your-home',
        title: { key: 'Your home' },
        items: [
          { field: 'street', columnSpan: 6 },
          { field: 'livingSpace', columnSpan: 3 },
          { field: 'zipCode', columnSpan: 3 },
          { field: 'subType', columnSpan: 6 },
        ],
        cta: { key: 'Next step' },
      },
      {
        id: 'insured-people',
        title: { key: 'Insured people' },
        items: [
          { field: 'birthDate', columnSpan: 3 },
          { field: 'numberCoInsured', columnSpan: 3 },
        ],
        cta: { key: 'Calculate price' },
      },
    ],
  },

  fields: {
    isMover: {
      widget: 'radio',
      title: { key: 'Are you moving?' },
      required: true,
      defaultValue: 'no',
      options: [
        {
          label: { key: 'Yes' },
          value: 'yes',
        },
        {
          label: { key: 'No' },
          value: 'no',
        },
      ],
    },
    personalNumber: {
      widget: 'text',
      title: { key: 'Autofill with personal number (Optional)' },
    },
    birthDate: {
      widget: 'date',
    },
    subType: {
      widget: 'radio',
      options: [
        {
          label: { key: 'I rent' },
          value: 'RENT',
        },
        {
          label: { key: 'I own' },
          value: 'OWN',
        },
      ],
    },
    numberCoInsured: {
      defaultValue: 1,
    },
  },
}
