import { Template } from '../PriceCalculator.types'

export const NO_HOUSE: Template = {
  name: 'NO_HOUSE',
  initialData: {
    isStudent: false,
  },
  sections: [
    {
      id: 'your-info',
      title: { key: 'Your info' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: {
            type: 'date',
            name: 'birthDate',
            label: { key: 'Date of birth' },
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
            type: 'text',
            name: 'street',
            label: { key: 'Address' },
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'text',
            name: 'zipCode',
            label: { key: 'Postal code' },
            minLength: 4,
            maxLength: 4,
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'squareMeters',
            label: { key: 'Square meters' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'yearOfConstruction',
            label: { key: 'Year of construction' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'yearOfOwnership',
            label: { key: 'Year of ownership' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'numberOfWetUnits',
            label: { key: 'Number of wet units' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'select',
            name: 'waterLeakageDetector',
            label: { key: 'Water leakage detector' },
            options: [
              { label: { key: 'Yes' }, value: 'true' },
              { label: { key: 'No' }, value: 'false' },
            ],
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'select',
            name: 'isSubleted',
            label: { key: 'Subletting' },
            options: [
              { label: { key: 'Yes' }, value: 'true' },
              { label: { key: 'No' }, value: 'false' },
            ],
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'extra-buildings',
            name: 'extraBuildings',
            label: { key: 'Extra buildings' },
            buildingOptions: [
              { label: { key: 'Garage' }, value: 'GARAGE' },
              { label: { key: 'Carport' }, value: 'CARPORT' },
              { label: { key: 'Shed' }, value: 'SHED' },
              { label: { key: 'Storehouse' }, value: 'STOREHOUSE' },
              { label: { key: 'Friggebod' }, value: 'FRIGGEBOD' },
              { label: { key: 'Attefall' }, value: 'ATTEFALL' },
              { label: { key: 'Outhouse' }, value: 'OUTHOUSE' },
              { label: { key: 'Guesthouse' }, value: 'GUESTHOUSE' },
              { label: { key: 'Gazebo' }, value: 'GAZEBO' },
              { label: { key: 'Greenhouse' }, value: 'GREENHOUSE' },
              { label: { key: 'Sauna' }, value: 'SAUNA' },
              { label: { key: 'Barn' }, value: 'BARN' },
              { label: { key: 'Boathouse' }, value: 'BOATHOUSE' },
              { label: { key: 'Other' }, value: 'OTHER' },
            ],
            defaultValue: [],
          },
          layout: { columnSpan: 6 },
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
            defaultValue: 0,
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
  ],
}
