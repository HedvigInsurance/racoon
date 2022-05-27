import { randomEmail } from '../DebuggerPage.helpers'
import { InputGroup } from '../DebuggerPage.types'

export const DENMARK_HOLDER: InputGroup = {
  title: 'Holder information',
  inputs: [
    { name: 'firstName', label: 'First name', defaultValue: 'Helle', type: 'text' },
    { name: 'lastName', label: 'Last name', defaultValue: 'Hansen', type: 'text' },
    { name: 'birthDate', label: 'Birth date', defaultValue: '1988-08-08', type: 'date' },
    {
      name: 'startDate',
      label: 'Start date (optional)',
      placeholder: '2020-03-13',
      type: 'date',
    },
    {
      name: 'email',
      label: 'Email',
      defaultValue: randomEmail(),
      type: 'email',
    },
  ],
}
