import { FormTemplateUISchema } from '../FormTemplate.types'

export const SWEDISH_APARTMENT_UI: FormTemplateUISchema = {
  layout: {
    sections: [
      {
        id: 'your-home',
        title: { key: 'Your home' },
        fields: [
          { name: 'street', columnSpan: 6 },
          { name: 'zipCode', columnSpan: 3 },
          { name: 'livingSpace', columnSpan: 3 },
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
    street: {
      title: { key: 'Address' },
    },
    zipCode: {
      title: { key: 'Postal code' },
    },
    livingSpace: {
      title: { key: 'Apartment size' },
    },
    birthDate: {
      title: { key: 'Your birthdate' },
      type: 'date',
    },
    subType: {
      title: { key: 'Ownership type' },
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
      title: { key: 'No. of people' },
      defaultValue: 1,
    },
  },
}
