import { FormTemplateUISchema } from '../FormTemplate.types'

export const NO_ACCIDENT_UI: FormTemplateUISchema = {
  layout: {
    sections: [
      {
        id: 'your-info',
        title: { key: 'Your info' },
        fields: [
          { name: 'street', columnSpan: 6 },
          { name: 'zipCode', columnSpan: 3 },
          { name: 'numberCoInsured', columnSpan: 3 },
          { name: 'birthDate', columnSpan: 6 },
        ],
        submit: { key: 'Calculate price' },
      },
    ],
  },

  fields: {
    street: { title: { key: 'Address' } },
    zipCode: { title: { key: 'Postal code' } },
    numberCoInsured: {
      title: { key: 'No. of people' },
      defaultValue: '1',
    },
    birthDate: {
      title: { key: 'Birth date' },
      type: 'date',
    },
  },
}
