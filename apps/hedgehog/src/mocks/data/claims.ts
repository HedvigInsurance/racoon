import { ListClaimsQuery } from 'types/generated/graphql'

export const claims: ListClaimsQuery['listClaims']['claims'] = [
  {
    id: 'becaffd8-9fa3-4304-b542-da18cd83c2f1',
    assignedAdmin: null,
    member: {
      memberId: '726751564',
      firstName: 'Mariia',
      lastName: 'Panasetskaia',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'becaffd8-9fa3-4304-b542-da18cd83c2f1',
        type: 'ACCIDENT_ABROAD',
        outcome: 'PAID_OUT',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-08-19T13:43:40.904233Z',
    state: 'CLOSED',
    __typename: 'Claim',
  },
  {
    id: 'b8699867-04eb-4954-b96f-17a07f8be073',
    assignedAdmin: null,
    member: {
      memberId: '585101477',
      firstName: 'Lucas Atallah',
      lastName: 'Larsson',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'b8699867-04eb-4954-b96f-17a07f8be073',
        type: 'ACCIDENTAL_DAMAGE',
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-07-29T12:06:52.068737Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '3cc9df64-5b32-419f-b246-c4cc9b3f6376',
    assignedAdmin: null,
    member: {
      memberId: '585101477',
      firstName: 'Lucas Atallah',
      lastName: 'Larsson',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '3cc9df64-5b32-419f-b246-c4cc9b3f6376',
        type: 'ACCIDENTAL_DAMAGE',
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-07-29T12:05:20.435568Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'ea69c76f-4a35-47bb-a3c3-5498e8b7c5d3',
    assignedAdmin: null,
    member: {
      memberId: '295083223',
      firstName: 'Sladan',
      lastName: 'Nimcevic',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'ea69c76f-4a35-47bb-a3c3-5498e8b7c5d3',
        type: 'LIABILITY',
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-07-22T13:49:37.330118Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '504b1956-c62c-4b0c-a1ae-9c38474012e9',
    assignedAdmin: null,
    member: {
      memberId: '295083223',
      firstName: 'Sladan',
      lastName: 'Nimcevic',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '504b1956-c62c-4b0c-a1ae-9c38474012e9',
        type: 'LIABILITY',
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-07-22T13:29:49.276345Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'd4095623-f791-43e5-9400-aa856e8b5337',
    assignedAdmin: null,
    member: {
      memberId: '351361861',
      firstName: 'Carl Oliver Erik',
      lastName: 'Lagerblad',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'd4095623-f791-43e5-9400-aa856e8b5337',
        type: 'ACCIDENT_ABROAD',
        outcome: 'COMPENSATION_BELOW_DEDUCTIBLE',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-06-25T08:44:31.608411Z',
    state: 'CLOSED',
    __typename: 'Claim',
  },
  {
    id: 'e62411f7-3944-49ca-a18e-5827d5827cd9',
    assignedAdmin: null,
    member: {
      memberId: '909962833',
      firstName: 'Alex Pierre',
      lastName: 'Lindberg',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'e62411f7-3944-49ca-a18e-5827d5827cd9',
        type: 'PET_CHRONIC_GASTROINTESTINAL_ISSUES',
        outcome: null,
        payments: [],
        reserve: {
          amount: 5000,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'e62411f7-3944-49ca-a18e-5827d5827cd9',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 5000,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-05-24T13:29:33.713370Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '61309b2f-99cf-4140-a760-4bc79affd879',
    assignedAdmin: null,
    member: {
      memberId: '909962833',
      firstName: 'Alex Pierre',
      lastName: 'Lindberg',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '61309b2f-99cf-4140-a760-4bc79affd879',
        type: 'PET_CLAW_INJURY',
        outcome: null,
        payments: [],
        reserve: {
          amount: 5000,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '61309b2f-99cf-4140-a760-4bc79affd879',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 5000,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-05-24T13:29:02.031832Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'cc5065e7-c3c2-4bd7-a9d2-6558c6aed263',
    assignedAdmin: null,
    member: {
      memberId: '232834814',
      firstName: 'Richard',
      lastName: 'Stening',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'cc5065e7-c3c2-4bd7-a9d2-6558c6aed263',
        type: 'PET_NON_CHRONIC_GASTROINTESTINAL_ISSUES',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: 'c5f118d9-4356-4b75-8f64-2f85dafb21fd',
            amount: {
              amount: 2000,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'cc5065e7-c3c2-4bd7-a9d2-6558c6aed263',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Update\n(0.0 SEK, Unknown)2024-06-28T12:32:17.817730136Z',
                text: 'Update\n(0.0 SEK, Unknown)',
                timestamp: '2024-06-28T12:32:17.817730136Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-05-21T07:48:40.669965Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'a6521508-a87a-490b-bef8-05145f81ee81',
    assignedAdmin: null,
    member: {
      memberId: '909962833',
      firstName: 'Alex Pierre',
      lastName: 'Lindberg',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'a6521508-a87a-490b-bef8-05145f81ee81',
        type: 'PET_ARTHRITIS_AND_JOINT_ISSUES',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '3a122891-f42e-43f3-973e-a6b54ec28e39',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-04-29T09:32:59.286583Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '01dd32be-3f93-4233-9c0f-302c0eaf602d',
    assignedAdmin: null,
    member: {
      memberId: '909962833',
      firstName: 'Alex Pierre',
      lastName: 'Lindberg',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '01dd32be-3f93-4233-9c0f-302c0eaf602d',
        type: 'PET_CLAW_INJURY',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '8dfc1e66-8837-4449-8735-769fa3bd344f',
            amount: {
              amount: 1000,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-04-26T11:09:02.068741Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'dd38c7c9-c6d2-420c-99c5-e8632317df90',
    assignedAdmin: null,
    member: {
      memberId: '909962833',
      firstName: 'Alex Pierre',
      lastName: 'Lindberg',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'dd38c7c9-c6d2-420c-99c5-e8632317df90',
        type: 'PET_BEHAVIOUR_THERAPY',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '1f536f27-7fd2-476d-91a0-628f9e700cc0',
            amount: {
              amount: 100,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
          {
            id: 'bea32110-0511-435a-a6db-0e736e8dbe5c',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'dd38c7c9-c6d2-420c-99c5-e8632317df90',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Set to 0 on claim close\n(0.0 SEK, Unknown)2024-04-29T10:57:50.793884808Z',
                text: 'Set to 0 on claim close\n(0.0 SEK, Unknown)',
                timestamp: '2024-04-29T10:57:50.793884808Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-04-25T11:42:25.084549Z',
    state: 'CLOSED',
    __typename: 'Claim',
  },
  {
    id: 'd747fc52-b900-4c4c-b0da-62f8ed45f540',
    assignedAdmin: null,
    member: {
      memberId: '700752136',
      firstName: 'Carl Fredrik',
      lastName: 'Tõnisson-Bystam',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'd747fc52-b900-4c4c-b0da-62f8ed45f540',
        type: null,
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-04-18T11:28:31.928145Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'ff9df644-44df-4b21-b82b-dc94236751f9',
    assignedAdmin: null,
    member: {
      memberId: '771717132',
      firstName: 'Anna Julia Cecilia',
      lastName: 'Andersson',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'ff9df644-44df-4b21-b82b-dc94236751f9',
        type: 'ACCIDENTAL_DAMAGE',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: 'b0079b57-3d77-486b-8282-dfd9b38dbcd5',
            amount: {
              amount: 400.22,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
          {
            id: '35c3d7b1-2b86-44cb-922a-863d96cb10e6',
            amount: {
              amount: 0.2,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
          {
            id: 'd919e6ab-6345-4850-9e21-f1c6885a12b2',
            amount: {
              amount: 1200,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'ff9df644-44df-4b21-b82b-dc94236751f9',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Update\n(199.8 SEK, Unknown)2024-04-02T08:17:56.068752914Z',
                text: 'Update\n(199.8 SEK, Unknown)',
                timestamp: '2024-04-02T08:17:56.068752914Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(0.0 SEK, Unknown)2024-04-02T08:47:28.764479885Z',
                text: 'Update\n(0.0 SEK, Unknown)',
                timestamp: '2024-04-02T08:47:28.764479885Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(66.0 SEK, Unknown)2024-06-27T14:57:04.391177021Z',
                text: 'Update\n(66.0 SEK, Unknown)',
                timestamp: '2024-06-27T14:57:04.391177021Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(0.0 SEK, Unknown)2024-06-27T14:57:30.264877022Z',
                text: 'Update\n(0.0 SEK, Unknown)',
                timestamp: '2024-06-27T14:57:30.264877022Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
      {
        id: '2c3ae116-a21c-4554-bd11-067ea9897035',
        type: 'APPLIANCE',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '64e3cf7c-62fa-4412-b46c-6c200cc6732c',
            amount: {
              amount: 3000,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '2c3ae116-a21c-4554-bd11-067ea9897035',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Update\n(0.0 SEK, Unknown)2024-06-27T15:01:10.948705056Z',
                text: 'Update\n(0.0 SEK, Unknown)',
                timestamp: '2024-06-27T15:01:10.948705056Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-28T07:49:07.383009Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'c9b0c57d-0676-4901-a384-74dd291487dc',
    assignedAdmin: null,
    member: {
      memberId: '986852565',
      firstName: 'Linus Timothy',
      lastName: 'Falk',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'c9b0c57d-0676-4901-a384-74dd291487dc',
        type: 'ACCIDENTAL_DAMAGE',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: 'f49ef813-1e48-4312-9a25-36c3311e9ff5',
            amount: {
              amount: 300,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'c9b0c57d-0676-4901-a384-74dd291487dc',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Update\n(0.0 SEK, Unknown)2024-04-05T11:03:09.241467755Z',
                text: 'Update\n(0.0 SEK, Unknown)',
                timestamp: '2024-04-05T11:03:09.241467755Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-25T14:02:31.586405Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '74a64ee9-304c-4687-b784-a013d1b056ee',
    assignedAdmin: null,
    member: {
      memberId: '986852565',
      firstName: 'Linus Timothy',
      lastName: 'Falk',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '74a64ee9-304c-4687-b784-a013d1b056ee',
        type: null,
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-25T14:01:46.884004Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'd669e474-b37b-405f-838a-90bd0aabffbb',
    assignedAdmin: null,
    member: {
      memberId: '132041740',
      firstName: 'Anna Julia Cecilia',
      lastName: 'Andersson',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'd669e474-b37b-405f-838a-90bd0aabffbb',
        type: null,
        outcome: 'TEST',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-20T16:28:50.430309Z',
    state: 'REOPENED',
    __typename: 'Claim',
  },
  {
    id: '2c8c4a28-a0dc-4dca-b557-507628e1242e',
    assignedAdmin: null,
    member: {
      memberId: '986852565',
      firstName: 'Linus Timothy',
      lastName: 'Falk',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '2c8c4a28-a0dc-4dca-b557-507628e1242e',
        type: null,
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-20T13:56:37.189876Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '63bbbdfe-ca92-4d47-9562-aca5d858b6f8',
    assignedAdmin: null,
    member: {
      memberId: '197769641',
      firstName: 'Eva Isabella',
      lastName: 'Gross',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '63bbbdfe-ca92-4d47-9562-aca5d858b6f8',
        type: null,
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-19T09:35:14.861682Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'ee8755e9-1428-44e3-8ce4-845dfa53c31b',
    assignedAdmin: {
      adminId: '0a940922-d6d3-4400-9b84-930357c41562',
      email: 'linus@hedvig.com',
      name: 'Linus Falk',
      __typename: 'AdminSystemUser',
    },
    member: {
      memberId: '986852565',
      firstName: 'Linus Timothy',
      lastName: 'Falk',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'ee8755e9-1428-44e3-8ce4-845dfa53c31b',
        type: 'DEATH',
        outcome: 'RETRACTED_BY_MEMBER',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-04T08:18:52.748679Z',
    state: 'OPEN',
    __typename: 'Claim',
  },

  {
    id: 'afd67a78-2f6a-4d31-8e00-9b8fcbd7ecf4',
    assignedAdmin: null,
    member: {
      memberId: '986852565',
      firstName: 'Linus Timothy',
      lastName: 'Falk',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'afd67a78-2f6a-4d31-8e00-9b8fcbd7ecf4',
        type: 'PET_DIABETES',
        outcome: 'PAID_OUT',
        payments: [],
        reserve: {
          amount: 4000,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'afd67a78-2f6a-4d31-8e00-9b8fcbd7ecf4',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 4000,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-03-01T15:13:38.503719Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '6b2797dd-400a-41a4-a503-edc080d70ba3',
    assignedAdmin: null,
    member: {
      memberId: '875358672',
      firstName: 'Sladan',
      lastName: 'Nimcevic',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '6b2797dd-400a-41a4-a503-edc080d70ba3',
        type: 'ANIMAL_COLLISION',
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-02-19T14:15:10.973508Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'f5327775-ce0a-4d4b-9a6d-746b81d095f6',
    assignedAdmin: {
      adminId: '0a940922-d6d3-4400-9b84-930357c41562',
      email: 'linus@hedvig.com',
      name: 'Linus Falk',
      __typename: 'AdminSystemUser',
    },
    member: {
      memberId: '958622795',
      firstName: 'Carl Fredrik',
      lastName: 'Tõnisson-Bystam',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'f5327775-ce0a-4d4b-9a6d-746b81d095f6',
        type: 'CARE_VET',
        outcome: 'RETRACTED_BY_MEMBER',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '9c963166-5372-436a-9f17-0039d62cab22',
            costCategory: 'EXAMINATION',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Cool new reserve\n(2000.0 SEK, Examination)2024-02-29T10:00:55.108048787Z',
                text: 'Cool new reserve\n(2000.0 SEK, Examination)',
                timestamp: '2024-02-29T10:00:55.108048787Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Set to 0 on claim close\n(0.0 SEK, Examination)2024-04-15T09:09:31.986175246Z',
                text: 'Set to 0 on claim close\n(0.0 SEK, Examination)',
                timestamp: '2024-04-15T09:09:31.986175246Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: 'a0dd63ec-027f-4fe0-95d5-5b77d683bab6',
                  email: 'richard.stening@hedvig.com',
                  name: 'Richard Stening',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
          {
            __typename: 'Reserve',
            id: 'f5327775-ce0a-4d4b-9a6d-746b81d095f6',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Update\n(7000.0 SEK, Unknown)2024-02-19T13:00:04.495459067Z',
                text: 'Update\n(7000.0 SEK, Unknown)',
                timestamp: '2024-02-19T13:00:04.495459067Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(5000.0 SEK, Unknown)2024-02-29T07:19:44.870721840Z',
                text: 'Update\n(5000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:19:44.870721840Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(6000.0 SEK, Unknown)2024-02-29T07:22:53.041318129Z',
                text: 'Update\n(6000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:22:53.041318129Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(7000.0 SEK, Unknown)2024-02-29T07:23:08.317550532Z',
                text: 'Update\n(7000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:23:08.317550532Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(5000.0 SEK, Unknown)2024-02-29T07:40:42.435103661Z',
                text: 'Update\n(5000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:40:42.435103661Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(6000.0 SEK, Unknown)2024-02-29T07:41:40.694632973Z',
                text: 'Update\n(6000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:41:40.694632973Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(4000.0 SEK, Unknown)2024-02-29T07:41:58.264245336Z',
                text: 'Update\n(4000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:41:58.264245336Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(5000.0 SEK, Unknown)2024-02-29T07:45:08.958315984Z',
                text: 'Update\n(5000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:45:08.958315984Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(6000.0 SEK, Unknown)2024-02-29T07:58:11.014575760Z',
                text: 'Update\n(6000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:58:11.014575760Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'A new note\n(7000.0 SEK, Unknown)2024-02-29T07:58:19.919462644Z',
                text: 'A new note\n(7000.0 SEK, Unknown)',
                timestamp: '2024-02-29T07:58:19.919462644Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Hej svej\n(8000.0 SEK, Unknown)2024-02-29T09:52:14.917759771Z',
                text: 'Hej svej\n(8000.0 SEK, Unknown)',
                timestamp: '2024-02-29T09:52:14.917759771Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(10000.0 SEK, Unknown)2024-02-29T10:01:35.963046305Z',
                text: 'Update\n(10000.0 SEK, Unknown)',
                timestamp: '2024-02-29T10:01:35.963046305Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(11000.0 SEK, Unknown)2024-02-29T10:06:45.454155591Z',
                text: 'Update\n(11000.0 SEK, Unknown)',
                timestamp: '2024-02-29T10:06:45.454155591Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(12000.0 SEK, Unknown)2024-02-29T10:08:05.058308085Z',
                text: 'Update\n(12000.0 SEK, Unknown)',
                timestamp: '2024-02-29T10:08:05.058308085Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(13000.0 SEK, Unknown)2024-02-29T10:08:24.508478213Z',
                text: 'Update\n(13000.0 SEK, Unknown)',
                timestamp: '2024-02-29T10:08:24.508478213Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Set to 0 on claim close\n(0.0 SEK, Unknown)2024-04-15T09:09:31.980941449Z',
                text: 'Set to 0 on claim close\n(0.0 SEK, Unknown)',
                timestamp: '2024-04-15T09:09:31.980941449Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: 'a0dd63ec-027f-4fe0-95d5-5b77d683bab6',
                  email: 'richard.stening@hedvig.com',
                  name: 'Richard Stening',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
      {
        id: '06db3564-9f61-480e-8e39-dc708edc2da3',
        type: 'ACCIDENT_ABROAD',
        outcome: 'UNRESPONSIVE',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '06db3564-9f61-480e-8e39-dc708edc2da3',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'fett bra\n(1000.0 SEK, Unknown)2024-02-29T10:25:59.818644256Z',
                text: 'fett bra\n(1000.0 SEK, Unknown)',
                timestamp: '2024-02-29T10:25:59.818644256Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Set to 0 on claim close\n(0.0 SEK, Unknown)2024-04-15T09:09:31.986763023Z',
                text: 'Set to 0 on claim close\n(0.0 SEK, Unknown)',
                timestamp: '2024-04-15T09:09:31.986763023Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: 'a0dd63ec-027f-4fe0-95d5-5b77d683bab6',
                  email: 'richard.stening@hedvig.com',
                  name: 'Richard Stening',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
      {
        id: '0bfc2fb2-cee6-4095-a35a-78cd0d296a5d',
        type: 'BIRTH_VET',
        outcome: 'NOT_COVERED_BY_TERMS',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '0bfc2fb2-cee6-4095-a35a-78cd0d296a5d',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Set to 0 on claim close\n(0.0 SEK, Unknown)2024-04-15T09:09:31.987163317Z',
                text: 'Set to 0 on claim close\n(0.0 SEK, Unknown)',
                timestamp: '2024-04-15T09:09:31.987163317Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: 'a0dd63ec-027f-4fe0-95d5-5b77d683bab6',
                  email: 'richard.stening@hedvig.com',
                  name: 'Richard Stening',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-02-14T14:51:52.716264Z',
    state: 'CLOSED',
    __typename: 'Claim',
  },
  {
    id: '74773a77-8a83-40ea-801b-579d7c8a3a42',
    assignedAdmin: null,
    member: {
      memberId: '958622795',
      firstName: 'Carl Fredrik',
      lastName: 'Tõnisson-Bystam',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '74773a77-8a83-40ea-801b-579d7c8a3a42',
        type: 'ACCIDENTAL_DAMAGE',
        outcome: null,
        payments: [],
        reserve: {
          amount: 10000,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '74773a77-8a83-40ea-801b-579d7c8a3a42',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 10000,
              currency: 'SEK',
            },
            notes: [
              {
                id: 'Default reserve for Accidental Damage\n(2500.0 SEK, Unknown)2024-02-19T13:59:19.035235290Z',
                text: 'Default reserve for Accidental Damage\n(2500.0 SEK, Unknown)',
                timestamp: '2024-02-19T13:59:19.035235290Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'Update\n(0.0 SEK, Unknown)2024-02-19T14:00:14.241959745Z',
                text: 'Update\n(0.0 SEK, Unknown)',
                timestamp: '2024-02-19T14:00:14.241959745Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a940922-d6d3-4400-9b84-930357c41562',
                  email: 'linus@hedvig.com',
                  name: 'Linus Falk',
                },
                __typename: 'ReserveNote',
              },
              {
                id: 'good stuff\n(10000.0 SEK, Unknown)2024-04-12T07:23:21.040235696Z',
                text: 'good stuff\n(10000.0 SEK, Unknown)',
                timestamp: '2024-04-12T07:23:21.040235696Z',
                author: {
                  __typename: 'AdminSystemUser',
                  adminId: '0a3a7248-6463-4948-bd2a-7d82b0bee404',
                  email: 'fredrik.bystam@hedvig.com',
                  name: 'Fredrik Tõnisson-Bystam',
                },
                __typename: 'ReserveNote',
              },
            ],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-02-05T15:42:42.667821Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'f383a24a-291a-4999-a2b4-10c2dde634be',
    assignedAdmin: null,
    member: {
      memberId: '850668179',
      firstName: 'Jakob Hugo Tobias',
      lastName: 'Linder',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'f383a24a-291a-4999-a2b4-10c2dde634be',
        type: 'ACCIDENTAL_DAMAGE',
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2024-01-23T08:55:54.613090Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '1b634600-c9ed-43af-a454-1d7ccc189d81',
    assignedAdmin: null,
    member: {
      memberId: '219461298',
      firstName: 'Sladan',
      lastName: 'Nimcevic',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '1b634600-c9ed-43af-a454-1d7ccc189d81',
        type: null,
        outcome: 'COMPENSATION_BELOW_DEDUCTIBLE',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-12-04T14:02:07.729375Z',
    state: 'CLOSED',
    __typename: 'Claim',
  },
  {
    id: 'dec8aa2c-6249-437e-a3a0-253418c1f274',
    assignedAdmin: null,
    member: {
      memberId: '371171494',
      firstName: 'Eva Isabella',
      lastName: 'Gross',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'dec8aa2c-6249-437e-a3a0-253418c1f274',
        type: 'CARE_VET',
        outcome: null,
        payments: [],
        reserve: {
          amount: 50000,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'dec8aa2c-6249-437e-a3a0-253418c1f274',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 50000,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-11-22T15:12:37.970455Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '88facdc1-4526-4f4b-87ab-98618accfab4',
    assignedAdmin: null,
    member: {
      memberId: '415621408',
      firstName: 'Anna Julia Cecilia',
      lastName: 'Andersson',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '88facdc1-4526-4f4b-87ab-98618accfab4',
        type: null,
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '88facdc1-4526-4f4b-87ab-98618accfab4',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-07-17T13:08:43.267725Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '7c032488-e833-4c05-b915-24883a974833',
    assignedAdmin: null,
    member: {
      memberId: '414683488',
      firstName: 'Lusse',
      lastName: 'Lelle',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '7c032488-e833-4c05-b915-24883a974833',
        type: 'ADVICE_FIRSTVET',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '893ad0df-5430-4a1d-bd9e-29deef960ee5',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 3000,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '7c032488-e833-4c05-b915-24883a974833',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 3000,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-04-27T09:38:27.577040Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: 'ad2f5e69-2739-43f8-9a0d-7653ff6aed9f',
    assignedAdmin: null,
    member: {
      memberId: '367544619',
      firstName: 'Jakob',
      lastName: 'Overgaard',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: 'ad2f5e69-2739-43f8-9a0d-7653ff6aed9f',
        type: 'ADVICE_FIRSTVET',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '59af0c07-4baf-469c-a94b-f124be909f05',
            amount: {
              amount: 2500,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'ad2f5e69-2739-43f8-9a0d-7653ff6aed9f',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
      {
        id: '26891acf-6faf-4b4a-9034-17cf30643cb1',
        type: 'ACCIDENTAL_DAMAGE',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '1e8ea086-e942-4f66-b398-3193b88fafa1',
            amount: {
              amount: 4000,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '26891acf-6faf-4b4a-9034-17cf30643cb1',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
      {
        id: 'e887b622-750b-4f38-9816-131a0cbafcde',
        type: 'BIRTH_VET',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '92b4dbd7-e0c2-4685-ac03-39c659d0f7bd',
            amount: {
              amount: 5500,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: 'e887b622-750b-4f38-9816-131a0cbafcde',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-04-24T11:28:03.105489Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '1ae6c8c9-4186-4742-b5c2-1df4ed45f145',
    assignedAdmin: null,
    member: {
      memberId: '832734251',
      firstName: 'Julia',
      lastName: 'Andersson',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '1ae6c8c9-4186-4742-b5c2-1df4ed45f145',
        type: 'ADVICE_FIRSTVET',
        outcome: 'PAID_OUT',
        payments: [
          {
            id: '0b5d69e4-05ed-456a-ba0b-72bda96b729a',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            __typename: 'ClaimPayment',
          },
        ],
        reserve: {
          amount: 2000,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '1ae6c8c9-4186-4742-b5c2-1df4ed45f145',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 2000,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-04-21T09:30:21.185161Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '9011cbc8-21c6-4cc4-a207-924053b1f1fd',
    assignedAdmin: null,
    member: {
      memberId: '924960892',
      firstName: 'Perra',
      lastName: 'Stålhandske',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '9011cbc8-21c6-4cc4-a207-924053b1f1fd',
        type: null,
        outcome: 'TEST',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '9011cbc8-21c6-4cc4-a207-924053b1f1fd',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-04-05T12:45:40.908992Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '2cf3d12c-179a-4523-8887-99856f9912b0',
    assignedAdmin: null,
    member: {
      memberId: '924960892',
      firstName: 'Perra',
      lastName: 'Stålhandske',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '2cf3d12c-179a-4523-8887-99856f9912b0',
        type: null,
        outcome: 'TEST',
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '2cf3d12c-179a-4523-8887-99856f9912b0',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-04-05T12:40:07.666120Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
  {
    id: '0d823e3a-72b1-4027-92d4-e2ddbc582ea3',
    assignedAdmin: null,
    member: {
      memberId: '367544619',
      firstName: 'Jakob',
      lastName: 'Overgaard',
      __typename: 'Member',
    },
    subclaims: [
      {
        id: '0d823e3a-72b1-4027-92d4-e2ddbc582ea3',
        type: 'ADVICE_FIRSTVET',
        outcome: null,
        payments: [],
        reserve: {
          amount: 0,
          currency: 'SEK',
        },
        reserves: [
          {
            __typename: 'Reserve',
            id: '0d823e3a-72b1-4027-92d4-e2ddbc582ea3',
            costCategory: 'UNKNOWN',
            amount: {
              amount: 0,
              currency: 'SEK',
            },
            notes: [],
          },
        ],
        __typename: 'Subclaim',
      },
    ],
    market: 'SWEDEN',
    openedAt: '2023-03-30T15:33:30.038209Z',
    state: 'OPEN',
    __typename: 'Claim',
  },
]
