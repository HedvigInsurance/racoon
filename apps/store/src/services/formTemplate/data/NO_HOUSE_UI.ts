import { FormTemplateUISchema } from '../FormTemplate.types'

export const NO_HOUSE_UI: FormTemplateUISchema = {
  layout: {
    sections: [
      {
        id: 'your-info',
        title: { key: 'Your Info' },
        fields: [
          { name: 'street', columnSpan: 6 },
          { name: 'zipCode', columnSpan: 3 },
          { name: 'numberCoInsured', columnSpan: 3 },
        ],
        submit: { key: 'Next Step' },
      },
      {
        id: 'your-home',
        title: { key: 'Your Home' },
        fields: [
          { name: 'squareMeters', columnSpan: 3 },
          { name: 'yearOfConstruction', columnSpan: 3 },
          { name: 'numberOfWetUnits', columnSpan: 6 },
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
    squareMeters: { title: { key: 'Living Area' }, type: 'number' },
    yearOfConstruction: { title: { key: 'Year of Construction' }, type: 'number' },
    numberOfWetUnits: { title: { key: 'Number of Wet Units' }, type: 'number' },
  },
}
