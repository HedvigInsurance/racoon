import { InputGroup } from '../DebuggerPage.types'

export const NORWAY_HOLDER: InputGroup = {
  title: 'Holder information',
  inputs: [
    { name: 'firstName', label: 'First name', defaultValue: 'Ole', type: 'text' },
    { name: 'lastName', label: 'Last name', defaultValue: 'Olsen', type: 'text' },
    { name: 'birthDate', label: 'Birth date', defaultValue: '1995-09-29', type: 'date' },
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
