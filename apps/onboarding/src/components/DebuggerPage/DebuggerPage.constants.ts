import { Market } from '@/lib/types'
import { Form, InputGroup } from './DebuggerPage.types'

export enum PageInput {
  Market = 'market',
  Bundle = 'bundle',
}

export const MARKETS = Object.entries(Market).map(([name, value]) => ({ name, value }))

const SWEDISH_INPUT_GROUPS: Array<InputGroup> = [
  {
    title: 'Holder information',
    inputs: [
      { name: 'firstName', label: 'First name', defaultValue: 'Sven', type: 'text' },
      { name: 'lastName', label: 'Last name', defaultValue: 'Svensson', type: 'text' },
      { name: 'birthDate', label: 'Birth date', defaultValue: '1995-09-29', type: 'date' },
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
  },
  {
    title: 'Insurace information',
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
          { name: 'Student BRF', value: 'STUDENT_BRF' },
          { name: 'Student Rent', value: 'STUDENT_RENT' },
        ],
      },
      { name: 'data.currentInsurer', label: 'Current insurer (optional)', type: 'text' },
    ],
  },
]

export const FORMS_PER_MARKET: Record<Market, Record<string, Form>> = {
  [Market.Sweden]: {
    Apartment: {
      staticData: [{ 'data.type': 'SWEDISH_APARTMENT' }],
      inputGroups: SWEDISH_INPUT_GROUPS,
    },
    'Apartment + Accident': {
      staticData: [{ 'data.type': 'SWEDISH_APARTMENT' }, { 'data.type': 'SWEDISH_ACCIDENT' }],
      inputGroups: SWEDISH_INPUT_GROUPS,
    },
  },
  [Market.Norway]: {},
  [Market.Denmark]: {},
}
