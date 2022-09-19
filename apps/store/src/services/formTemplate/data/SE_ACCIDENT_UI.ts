import { FormTemplateUISchema } from '../FormTemplate.types'

export const SE_ACCIDENT_UI: FormTemplateUISchema = {
  layout: {
    sections: [
      {
        id: 'your-home',
        title: { key: 'Your home' },
        fields: [
          { name: 'street', columnSpan: 6 },
          { name: 'zipCode', columnSpan: 3 },
          { name: 'livingSpace', columnSpan: 3 },
        ],
        submit: { key: 'Next step' },
      },
      {
        id: 'insured-people',
        title: { key: 'Insured people' },
        fields: [
          { name: 'ssn', columnSpan: 6 },
          { name: 'numberCoInsured', columnSpan: 6 },
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
    ssn: {
      title: { key: 'Personal number' },
    },
    numberCoInsured: {
      title: { key: 'No. of people' },
      defaultValue: '1',
    },
  },
}
