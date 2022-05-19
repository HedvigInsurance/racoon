import { InputGroup } from '../DebuggerPage.types'

export const SWEDEN_HOUSE: InputGroup = {
  title: 'Insurance information',
  inputs: [
    {
      name: 'data.numberCoInsured',
      label: 'Number of co-insured',
      defaultValue: '1',
      type: 'number',
    },
    {
      name: 'data.livingSpace',
      label: 'Living space',
      defaultValue: '23',
      type: 'number',
    },
    {
      name: 'data.ancillaryArea',
      label: 'Living space',
      defaultValue: '0',
      type: 'number',
    },
    {
      name: 'data.street',
      label: 'Street address',
      defaultValue: 'Storgatan 1',
      type: 'text',
    },
    { name: 'data.zipCode', label: 'Zip code', defaultValue: '12345', type: 'text' },
    {
      name: 'data.numberOfBathrooms',
      label: 'Number of bathrooms',
      defaultValue: '1',
      type: 'number',
    },
    {
      name: 'data.yearOfConstruction',
      label: 'Year of construction',
      defaultValue: '2006',
      type: 'number',
    },
    { name: 'data.currentInsurer', label: 'Current insurer (optional)', type: 'text' },
  ],
}
