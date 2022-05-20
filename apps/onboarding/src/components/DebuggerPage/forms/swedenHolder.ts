import { InputGroup } from '../DebuggerPage.types'

export const SWEDEN_HOLDER: InputGroup = {
  title: 'Holder information',
  inputs: [
    { name: 'firstName', label: 'First name', defaultValue: 'Sven', type: 'text' },
    { name: 'lastName', label: 'Last name', defaultValue: 'Svensson', type: 'text' },
    { name: 'ssn', label: 'SSN', defaultValue: '199509291234', type: 'text' },
    {
      name: 'startDate',
      label: 'Start date (optional)',
      placeholder: '2020-03-13',
      type: 'date',
    },
    {
      name: 'email',
      label: 'Email',
      defaultValue: 'sven.svensson@hedvig.com',
      type: 'email',
    },
  ],
}
