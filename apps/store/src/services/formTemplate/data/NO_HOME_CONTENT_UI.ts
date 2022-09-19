import { FormTemplateUISchema } from '../FormTemplate.types'

export const NO_HOME_CONTENT_UI: FormTemplateUISchema = {
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
          { name: 'numberCoInsured', columnSpan: 6 },
        ],
        submit: { key: 'Calculate price' },
      },
    ],
  },

  fields: {
    street: { title: { key: 'Address' } },
    zipCode: { title: { key: 'Postal code' } },
    livingSpace: { title: { key: 'Home size' } },
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
      defaultValue: '1',
    },

    isStudent: {
      type: 'hidden',
      defaultValue: 'false',
    },
  },
}
