import { PriceForm } from './PriceCalculator.types'

export const SWEDEN_APARTMENT_FORM: PriceForm = {
  groups: [
    {
      id: 'group1',
      title: { text: 'Your residence' },
      inputs: [
        {
          name: 'street',
          label: { text: 'Address' },
          placeholder: { text: 'Enter your street address' },
          type: 'text',
          required: true,
        },
        {
          name: 'zipCode',
          label: { text: 'Zip code' },
          placeholder: { text: 'XXX XX' },
          type: 'text',
          required: true,
          // https://gist.github.com/jamesbar2/1c677c22df8f21e869cca7e439fc3f5b
          pattern: '^\\d{3}\\s*\\d{2}$',
        },
        {
          name: 'livingSpace',
          label: { text: 'Size' },
          placeholder: { text: '120 m²' },
          type: 'number',
          min: 20,
          max: 200,
          required: true,
        },
        {
          name: 'subType',
          label: { text: 'Do you own your home?' },
          type: 'select',
          options: [
            { name: { text: `Yes, it's a BRF` }, value: 'BRF' },
            { name: { text: `No, I'm renting` }, value: 'RENT' },
          ],
          placeholder: { text: 'Select an option' },
          required: true,
        },
      ],
      state: 'IDLE',
    },
    {
      id: 'group2',
      title: { text: 'You and your family' },
      inputs: [
        {
          name: 'age',
          label: { text: 'Your age' },
          placeholder: { text: '31' },
          type: 'number',
          min: 18,
          max: 120,
          required: true,
        },
        {
          name: 'numberOfCoInsured',
          label: { text: 'People the policy should cover' },
          placeholder: { text: '4' },
          type: 'number',
          min: 1,
          max: 6,
          required: true,
        },
      ],
      state: 'IDLE',
    },
  ],
}
