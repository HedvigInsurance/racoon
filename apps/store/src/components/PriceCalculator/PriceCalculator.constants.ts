import { GroupSummary, Input, PriceForm } from './PriceCalculator.types'

const STREET_INPUT: Input = {
  name: 'street',
  label: { key: 'Address' },
  placeholder: { key: 'Enter your street address' },
  type: 'text',
  required: true,
  columnSpan: 2,
}

const ZIP_CODE_INPUT: Input = {
  name: 'zipCode',
  label: { key: 'Postal code' },
  placeholder: { key: 'XXX XX' },
  type: 'text',
  required: true,
  // https://gist.github.com/jamesbar2/1c677c22df8f21e869cca7e439fc3f5b
  pattern: '^\\d{3}\\s*\\d{2}$',
}

const ADDRESS_SUMMARY: GroupSummary = {
  labels: [
    {
      key: 'PRICE_CALCULATOR.SUMMARY.ADDRESS',
      placeholders: [
        { pattern: 'STREET', key: 'street' },
        { pattern: 'ZIP_CODE', key: 'zipCode' },
      ],
    },
  ],
}

export const SWEDEN_APARTMENT_FORM: PriceForm = {
  groups: [
    {
      id: 'group1',
      title: { key: 'Your residence' },
      inputs: [
        STREET_INPUT,
        ZIP_CODE_INPUT,
        {
          name: 'livingSpace',
          label: { key: 'Apartment size' },
          placeholder: { key: '34 m²' },
          type: 'number',
          min: 20,
          max: 200,
          required: true,
        },
        {
          name: 'numberOfCoInsured',
          label: { key: 'No. of people' },
          type: 'select',
          defaultValue: '1',
          options: [
            { name: { key: '1' }, value: '1' },
            { name: { key: '2' }, value: '2' },
            { name: { key: '3' }, value: '3' },
            { name: { key: '4' }, value: '4' },
            { name: { key: '5' }, value: '5' },
            { name: { key: '6+' }, value: '6' },
          ],
          required: true,
        },
        {
          name: 'birthDate',
          label: { key: 'Your birthdate' },
          placeholder: { key: '1999-08-21' },
          type: 'date',
          required: true,
        },
        {
          name: 'subType',
          label: { key: 'Ownership type' },
          type: 'radio',
          defaultValue: 'RENT',
          options: [
            { label: { key: 'I rent' }, value: 'RENT' },
            { label: { key: 'I own' }, value: 'BRF' },
          ],
          required: true,
          columnSpan: 3,
        },
      ],
      state: 'IDLE',
      summary: ADDRESS_SUMMARY,
    },
  ],
}

export const SWEDEN_CAR_FORM: PriceForm = {
  groups: [
    {
      id: 'group1',
      title: { key: 'Your residence' },
      inputs: [STREET_INPUT, ZIP_CODE_INPUT],
      state: 'IDLE',
      summary: ADDRESS_SUMMARY,
    },
    {
      id: 'group2',
      title: { key: 'Your vehicle' },
      inputs: [
        {
          name: 'registrationNumber',
          label: { key: 'Registration number' },
          placeholder: { key: 'ABC 123' },
          type: 'text',
          required: true,
        },
        {
          name: 'mileage',
          label: { key: 'Annual mileage' },
          placeholder: { key: '1000' },
          type: 'number',
          min: 1000,
          max: 2500,
          required: true,
        },
      ],
      state: 'IDLE',
      summary: {
        labels: [
          {
            key: 'CHECKOUT_DETAILS_CAR_VALUE',
            placeholders: [{ pattern: 'VALUE', key: 'registrationNumber' }],
          },
        ],
      },
    },
  ],
}
