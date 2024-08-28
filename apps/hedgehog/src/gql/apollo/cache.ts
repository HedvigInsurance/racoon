import { InMemoryCache } from '@apollo/client'

export const cache = new InMemoryCache({
  possibleTypes: {
    SystemUser: [
      'AdminSystemUser',
      'MemberSystemUser',
      'UnknownSystemUser',
      'EmailSystemUser',
    ],
  },
  typePolicies: {
    Me: {
      keyFields: ['email'],
    },
    Member: {
      keyFields: ['memberId'],
      fields: {
        contractMarketInfo: {
          merge(
            existing = { market: '', preferredCurrency: '' },
            incoming: { market: ''; preferredCurrency: '' },
          ) {
            return { ...existing, ...incoming }
          },
        },
      },
    },
    ResourceAccessInformation: {
      keyFields: ['resourceId'],
    },
    ChatMessage: {
      keyFields: ['globalId'],
    },
    MemberReferral: {
      keyFields: ['memberId'],
    },
    AdminSystemUser: {
      keyFields: ['adminId'],
    },
    MemberSystemUser: {
      keyFields: ['memberId'],
    },
    ClaimEvent: {
      keyFields: ['text', 'date'],
    },
    ClaimFile: {
      keyFields: ['claimFileId'],
    },
    ManyPetsPolicy: {
      keyFields: ['policyId'],
    },
    InsurableLimitsCategory: {
      keyFields: false,
    },
    Query: {
      fields: {
        employees: {
          merge: false,
        },
      },
    },
  },
})
