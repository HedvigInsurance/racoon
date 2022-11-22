import { Template } from '../PriceForm.types'

export const SE_CAR: Template = {
  name: 'SE_CAR',
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
      id: 'your-car',
      title: { key: 'Your car' },
      submitLabel: { key: 'Next step' },
      items: [
        {
          field: {
            type: 'car-registration-number',
            name: 'registrationNumber',
            label: { key: 'Registration number' },
            required: true,
          },
          layout: { columnSpan: 6 },
        },
        {
          field: {
            type: 'select',
            name: 'mileage',
            label: { key: 'Annual mileage' },
            required: true,
            options: [
              { label: { key: '10 000 km/year' }, value: '1000' },
              { label: { key: '15 000 km/year' }, value: '1500' },
              { label: { key: '20 000 km/year' }, value: '2000' },
              { label: { key: '25 000 km/year' }, value: '2500' },
              { label: { key: '20 500+ km/year' }, value: '2501' },
            ],
          },
          layout: { columnSpan: 6 },
        },
      ],
    },
    {
      id: 'your-address',
      title: { key: 'Your address' },
      submitLabel: { key: 'Calculate price' },
      items: [
        {
          field: {
            type: 'text',
            name: 'street',
            label: { key: 'Address' },
            required: true,
          },
          layout: { columnSpan: 4 },
        },
        {
          field: {
            type: 'text',
            name: 'zipCode',
            inputMode: 'numeric',
            label: { key: 'Postal code' },
            minLength: 5,
            maxLength: 5,
            required: true,
          },
          layout: { columnSpan: 2 },
        },
      ],
    },
  ],
}
