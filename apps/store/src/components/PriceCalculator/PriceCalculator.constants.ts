import { PriceForm } from './PriceCalculator.types'

export const SWEDEN_APARTMENT_FORM: PriceForm = {
  groups: [
    {
      id: 'group1',
      title: { key: 'Your residence' },
      inputs: [
        {
          name: 'street',
          label: { key: 'Address' },
          placeholder: { key: 'Enter your street address' },
          type: 'text',
          required: true,
        },
        {
          name: 'zipCode',
          label: { key: 'Zip code' },
          placeholder: { key: 'XXX XX' },
          type: 'text',
          required: true,
          // https://gist.github.com/jamesbar2/1c677c22df8f21e869cca7e439fc3f5b
          pattern: '^\\d{3}\\s*\\d{2}$',
        },
        {
          name: 'livingSpace',
          label: { key: 'Size' },
          placeholder: { key: '120 m²' },
          type: 'number',
          min: 20,
          max: 200,
          required: true,
        },
        {
          name: 'subType',
          label: { key: 'Do you own your home?' },
          type: 'select',
          options: [
            { name: { key: `Yes, it's a BRF` }, value: 'BRF' },
            { name: { key: `No, I'm renting` }, value: 'RENT' },
          ],
          placeholder: { key: 'Select an option' },
          required: true,
        },
      ],
      state: 'IDLE',
      summary: {
        labels: [
          {
            key: 'PRICE_CALCULATOR.SUMMARY.ADDRESS',
            placeholders: [
              { pattern: 'STREET', key: 'street' },
              { pattern: 'ZIP_CODE', key: 'zipCode' },
            ],
          },
        ],
      },
    },
    {
      id: 'group2',
      title: { key: 'You and your family' },
      inputs: [
        {
          name: 'age',
          label: { key: 'Your age' },
          placeholder: { key: '31' },
          type: 'number',
          min: 18,
          max: 120,
          required: true,
        },
        {
          name: 'numberOfCoInsured',
          label: { key: 'People the policy should cover' },
          placeholder: { key: '4' },
          type: 'number',
          min: 1,
          max: 6,
          required: true,
        },
      ],
      state: 'IDLE',
      summary: {
        labels: [
          {
            key: 'CHECKOUT_DETAILS_PERSONS_VALUE',
            placeholders: [{ pattern: 'VALUE', key: 'numberOfCoInsured' }],
          },
        ],
      },
    },
  ],
}
