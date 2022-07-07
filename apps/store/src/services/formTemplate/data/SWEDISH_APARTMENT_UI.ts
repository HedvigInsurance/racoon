import { FormTemplateUISchema } from '../FormTemplate.types'

export const SWEDISH_APARTMENT_UI: FormTemplateUISchema = {
  layout: {
    sections: [
      {
        id: 'autofill',
        title: { key: 'Your info' },
        fields: [
          { name: 'isMover', columnSpan: 6 },
          { name: 'personalNumber', columnSpan: 6 },
        ],
        submit: { key: 'Next step' },
      },
      {
        id: 'your-home',
        title: { key: 'Your home' },
        fields: [
          { name: 'street', columnSpan: 6 },
          { name: 'livingSpace', columnSpan: 3 },
          { name: 'zipCode', columnSpan: 3 },
          { name: 'subType', columnSpan: 6 },
        ],
        submit: { key: 'Next step' },
      },
      {
        id: 'insured-people',
        title: { key: 'Insured people' },
        fields: [
          { name: 'birthDate', columnSpan: 3 },
          { name: 'numberCoInsured', columnSpan: 3 },
        ],
        submit: { key: 'Calculate price' },
      },
    ],
  },

  fields: {
    isMover: {
      type: 'radio',
      required: true,
      defaultValue: 'no',
      options: [
        {
          label: { key: 'Where I live' },
          value: 'no',
        },
        {
          label: { key: "Where I'm moving" },
          value: 'yes',
        },
      ],
    },
    personalNumber: {
      type: 'text',
      title: { key: 'Autofill with personal number (Optional)' },
    },
    birthDate: {
      type: 'date',
    },
    subType: {
      type: 'radio',
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
