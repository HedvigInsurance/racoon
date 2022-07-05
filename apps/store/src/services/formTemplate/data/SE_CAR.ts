import { FormTemplate } from '../FormTemplate.types'

export const SE_CAR_TEMPLATE: FormTemplate = {
  groups: [
    {
      id: 'group1',
      title: { key: 'Your vehicle' },
      cta: { key: 'Calculate price' },
      inputs: [
        {
          name: 'registrationNumber',
          label: { key: 'Registration number' },
          placeholder: { key: 'ABC 123' },
          type: 'text',
          columnSpan: 3,
        },
        {
          name: 'mileage',
          label: { key: 'Annual mileage' },
          placeholder: { key: '1000' },
          type: 'number',
          min: 1000,
          max: 2500,
          columnSpan: 3,
        },
      ],
      state: 'INITIAL',
    },
  ],
}
