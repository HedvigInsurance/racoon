import { Template } from '../PriceForm.types'

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
            options: [
              { label: { key: 'Garage' }, value: 'garage' },
              { label: { key: 'Carport' }, value: 'carport' },
              { label: { key: 'Shed' }, value: 'shed' },
              { label: { key: 'Storehouse' }, value: 'storehouse' },
              { label: { key: 'Friggebod' }, value: 'friggebod' },
              { label: { key: 'Attefall' }, value: 'attefall' },
              { label: { key: 'Outhouse' }, value: 'outhouse' },
              { label: { key: 'Guesthouse' }, value: 'guesthouse' },
              { label: { key: 'Gazebo' }, value: 'gazebo' },
              { label: { key: 'Greenhouse' }, value: 'greenhouse' },
              { label: { key: 'Sauna' }, value: 'sauna' },
              { label: { key: 'Barn' }, value: 'barn' },
              { label: { key: 'Boathouse' }, value: 'boathouse' },
              { label: { key: 'Other' }, value: 'other' },
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
