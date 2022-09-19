import { FormTemplateUISchema } from '../FormTemplate.types'

export const NO_TRAVEL_UI: FormTemplateUISchema = {
  layout: {
    sections: [
      {
        id: 'you',
        title: { key: 'Your info' },
        fields: [
          { name: 'numberCoInsured', columnSpan: 6 },
          { name: 'isStudent', columnSpan: 6 },
        ],
        submit: { key: 'Calculate price' },
      },
    ],
  },

  fields: {
    numberCoInsured: {
      title: { key: 'No. of people' },
      defaultValue: '1',
    },
    isStudent: {
      title: { key: 'Student?' },
      type: 'radio',
      options: [
        {
          label: { key: 'Yes' },
          value: 'true',
        },
        {
          label: { key: 'No' },
          value: 'false',
        },
      ],
    },
  },
}
