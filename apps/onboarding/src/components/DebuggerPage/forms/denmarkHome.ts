import { InputGroup } from '../DebuggerPage.types'

export const DENMARK_HOME: InputGroup = {
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
      defaultValue: '44',
      type: 'number',
    },
    {
      name: 'data.street',
      label: 'Street address',
      defaultValue: 'Gulebøjsveien 1',
      type: 'text',
    },
    {
      name: 'data.floor',
      label: 'Floor',
      defaultValue: '2',
      type: 'number',
    },
    {
      name: 'data.apartment',
      label: 'Apartment',
      defaultValue: 'tv',
      type: 'text',
    },
    { name: 'data.zipCode', label: 'Zip code', defaultValue: '2100', type: 'text' },
    {
      name: 'data.subType',
      label: 'Owner type',
      defaultValue: 'RENT',
      type: 'select',
      options: [
        { name: 'Own', value: 'OWN' },
        { name: 'Rent', value: 'RENT' },
      ],
    },
  ],
}
