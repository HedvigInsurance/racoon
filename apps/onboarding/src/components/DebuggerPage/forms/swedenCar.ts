import { InputGroup } from '../DebuggerPage.types'

export const SWEDEN_CAR: InputGroup = {
  title: 'Insurance information',
  inputs: [
    {
      name: 'data.registrationNumber',
      label: 'Milage',
      defaultValue: 'ABC001',
      type: 'text',
    },
    {
      name: 'data.mileage',
      label: 'Registration number',
      defaultValue: '1000',
      type: 'select',
      options: [
        { name: '10,000 km per year', value: '1000' },
        { name: '15,000 km per year', value: '1500' },
        { name: '20,000 km per year', value: '2000' },
        { name: '25,000 km per year', value: '2500' },
        { name: '25,000+ km per year', value: '2501' },
      ],
    },
    {
      name: 'data.street',
      label: 'Street address',
      defaultValue: 'Malmskillnadsgtan 32',
      type: 'text',
    },
    { name: 'data.zipCode', label: 'Zip code', defaultValue: '11151', type: 'text' },
    { name: 'data.city', label: 'City', defaultValue: 'Stockholm', type: 'text' },
    {
      name: 'data.subType',
      label: 'Owner type',
      defaultValue: 'RENT',
      type: 'select',
      options: [
        { name: 'BRF', value: 'BRF' },
        { name: 'Rent', value: 'RENT' },
        { name: 'Student BRF', value: 'STUDENT_BRF' },
        { name: 'Student Rent', value: 'STUDENT_RENT' },
      ],
    },
    { name: 'data.currentInsurer', label: 'Current insurer (optional)', type: 'text' },
  ],
}
