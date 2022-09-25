import { FormTemplateUISchema } from '../FormTemplate.types'

export const SE_HOUSE_UI: FormTemplateUISchema = {
  layout: {
    sections: [
      {
        id: 'your-info',
        title: { key: 'Your info' },
        fields: [{ name: 'ssn', columnSpan: 6 }],
        submit: { key: 'Next step' },
      },
      {
        id: 'your-home',
        title: { key: 'Your home' },
        fields: [
          { name: 'street', columnSpan: 3 },
          { name: 'zipCode', columnSpan: 3 },

          { name: 'livingSpace', columnSpan: 3 },
          { name: 'ancillaryArea', columnSpan: 3 },

          { name: 'numberOfBathrooms', columnSpan: 3 },
          { name: 'yearOfConstruction', columnSpan: 3 },

          { name: 'isSubleted', columnSpan: 6 },
          { name: 'extraBuildings' },
        ],
        submit: { key: 'Next step' },
      },
      {
        id: 'insured-people',
        title: { key: 'Insured people' },
        fields: [{ name: 'numberCoInsured', columnSpan: 6 }],
        submit: { key: 'Calculate price' },
      },
    ],
  },

  fields: {
    ssn: {
      title: { key: 'Personal number' },
    },

    street: {
      title: { key: 'Address' },
    },
    zipCode: {
      title: { key: 'Postal code' },
    },
    livingSpace: {
      title: { key: 'Apartment size' },
    },
    ancillaryArea: {
      title: { key: 'Ancillary area' },
    },
    numberOfBathrooms: {
      title: { key: 'No. of bathrooms' },
    },
    yearOfConstruction: {
      title: { key: 'Built in' },
    },
    isSubleted: {
      title: { key: 'Subletting' },
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
    extraBuildings: {
      type: 'hidden',
      defaultValue: '',
    },

    numberCoInsured: {
      title: { key: 'No. of people' },
      defaultValue: '1',
    },
  },
}
