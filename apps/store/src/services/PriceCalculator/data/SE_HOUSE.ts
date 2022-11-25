import { Template } from '../PriceCalculator.types'

export const SE_HOUSE: Template = {
  name: 'SE_HOUSE',
  sections: [
    {
      id: 'your-info',
      title: { key: 'Your info' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: {
            type: 'ssn-se',
            name: 'ssn',
            label: { key: 'Personal number' },
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
            inputMode: 'numeric',
            label: { key: 'Postal code' },
            required: true,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'livingSpace',
            label: { key: 'House size' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'number',
            name: 'ancillaryArea',
            label: { key: 'Ancillary area' },
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
            name: 'numberOfBathrooms',
            label: { key: 'Number of bathrooms' },
            required: true,
            min: 0,
          },
          layout: { columnSpan: 3 },
        },
        {
          field: {
            type: 'select',
            name: 'isSubleted',
            label: { key: 'Subletting' },
            required: true,
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
            defaultValue: [],
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
            type: 'householdSize',
            name: 'numberCoInsured',
            label: { key: 'Household size' },
            required: true,
            defaultValue: 0,
            max: 5,
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
  ],
}
