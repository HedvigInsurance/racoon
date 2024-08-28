import { Keys } from '@hedvig-ui'

export const memberPagePanes = (memberId?: string) => [
  {
    tabTitle: 'Claims',
    tabName: 'claims',
    hotkey: {
      name: '1',
      key: Keys.One,
    },
    path: `members/${memberId}/claims`,
  },
  {
    tabTitle: 'Files',
    tabName: 'files',
    hotkey: {
      name: '2',
      key: Keys.Two,
    },
    path: `members/${memberId}/files`,
  },
  {
    tabTitle: 'Contracts',
    tabName: 'contracts',
    hotkey: {
      name: '3',
      key: Keys.Three,
    },
    path: `members/${memberId}/contracts`,
  },
  {
    tabTitle: 'Quotes',
    tabName: 'quotes',
    hotkey: {
      name: '4',
      key: Keys.Four,
    },
    path: `members/${memberId}/quotes`,
  },
  {
    tabTitle: 'Payments',
    tabName: 'payments',
    hotkey: {
      name: '5',
      key: Keys.Five,
    },
    path: `members/${memberId}/payments`,
  },
  {
    tabTitle: 'Account',
    tabName: 'account',
    hotkey: {
      name: '6',
      key: Keys.Six,
    },
    path: `members/${memberId}/account`,
  },
  {
    tabTitle: 'Member',
    tabName: 'member',
    hotkey: {
      name: '7',
      key: Keys.Seven,
    },
    path: `members/${memberId}/member`,
  },
  {
    tabTitle: 'Campaigns',
    tabName: 'campaigns',
    hotkey: {
      name: '8',
      key: Keys.Eight,
    },
    path: `members/${memberId}/campaigns`,
  },
]
