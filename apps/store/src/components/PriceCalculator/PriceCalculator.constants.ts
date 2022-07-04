import { GroupSummary, Input, PriceFormTemplate } from './PriceCalculator.types'

const STREET_INPUT: Input = {
  name: 'street',
  label: { key: 'Address' },
  placeholder: { key: 'Enter your street address' },
  type: 'text',
  columnSpan: 6,
}

const ZIP_CODE_INPUT: Input = {
  name: 'zipCode',
  label: { key: 'Postal code' },
  placeholder: { key: 'XXX XX' },
  type: 'text',
  // https://gist.github.com/jamesbar2/1c677c22df8f21e869cca7e439fc3f5b
  pattern: '^\\d{3}\\s*\\d{2}$',
  columnSpan: 3,
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

export const SWEDEN_APARTMENT_FORM: PriceFormTemplate = {
  groups: [
    {
      id: 'group0',
      title: { key: 'Co-insured' },
      cta: { key: 'Next step' },
      inputs: [
        {
          name: 'birthDate',
          label: { key: 'Your birthdate' },
          placeholder: { key: '1999-08-21' },
          type: 'date',
          columnSpan: 3,
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
          columnSpan: 3,
        },
      ],
      state: 'INITIAL',
      summary: { labels: [] },
    },
    {
      id: 'group1',
      title: { key: 'Your home' },
      cta: { key: 'Calculate price' },
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
          columnSpan: 3,
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
        },
      ],
      state: 'INITIAL',
      summary: ADDRESS_SUMMARY,
    },
  ],
}

export const SWEDEN_CAR_FORM: PriceFormTemplate = {
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
