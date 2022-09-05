import { InputGroup } from '../DebuggerPage.types'

export const SWEDEN_APARTMENT: InputGroup = {
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
      name: 'data.street',
      label: 'Street address',
      defaultValue: 'Storgatan 1',
      type: 'text',
    },
    { name: 'data.zipCode', label: 'Zip code', defaultValue: '12345', type: 'text' },
    {
      name: 'data.subType',
      label: 'Owner type',
      defaultValue: 'RENT',
      type: 'select',
      options: [
        { name: 'BRF', value: 'BRF' },
        { name: 'Rent', value: 'RENT' },
      ],
    },
    {
      name: 'data.isStudent',
      label: 'Is student',
      defaultValue: 'false',
      type: 'select',
      options: [
        { name: 'Yes', value: 'true' },
        { name: 'No', value: 'false' },
      ],
    },
    { name: 'data.currentInsurer', label: 'Current insurer (optional)', type: 'text' },
  ],
}
