import { InputGroup } from '../DebuggerPage.types'

export const NORWAY_HOUSE: InputGroup = {
  title: 'Insurance information',
  inputs: [
    {
      name: 'data.numberCoInsured',
      label: 'Number of co-insured',
      defaultValue: '1',
      type: 'number',
    },
    {
      name: 'data.squareMeters',
      label: 'Square meters',
      defaultValue: '44',
      type: 'number',
    },
    {
      name: 'data.street',
      label: 'Street address',
      defaultValue: 'Gulebøjsveien 1',
      type: 'text',
    },
    { name: 'data.zipCode', label: 'Zip code', defaultValue: '1234', type: 'text' },
    {
      name: 'data.yearOfConstruction',
      label: 'Year of construction',
      defaultValue: '2006',
      type: 'number',
    },
    {
      name: 'data.yearOfOwnership',
      label: 'Year of ownership',
      defaultValue: '2010',
      type: 'number',
    },
    {
      name: 'data.numberOfWetUnits',
      label: 'Number of wet units',
      defaultValue: '1',
      type: 'number',
    },
    { name: 'data.currentInsurer', label: 'Current insurer (optional)', type: 'text' },
  ],
}
