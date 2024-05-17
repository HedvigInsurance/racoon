import { test, expect } from '@jest/globals'
import type { ShopSessionRetargetingQuery } from '@/services/graphql/generated'
import { RedirectType, getUserRedirect } from './getUserRedirect'
import type { UserParams } from './retargeting.types'

const userParams: UserParams = {
  shopSessionId: '123',
  locale: 'se',
  campaignCode: 'discount123',
  queryParams: [],
}

test('should return fallback redirect if no data is provided', () => {
  // Arrange
  const data = null

  // Act
  const result = getUserRedirect(userParams, data)

  // Assert
  expect(result.type).toEqual(RedirectType.Fallback)
})

test('should return cart redirect if cart is not empty', () => {
  // Arrange
  const data: ShopSessionRetargetingQuery = {
    shopSession: {
      id: '123',
      cart: {
        entries: [{ id: '123:offer1' }],
        campaignsEnabled: true,
      },
      priceIntents: [
        {
          id: '123',
          product: { name: 'test' },
          data: { street: 'testgatan 1' },
          defaultOffer: FAKE_OFFER,
        },
      ],
    },
  }

  // Act
  const result = getUserRedirect(userParams, data)

  // Assert
  expect(result.type).toEqual(RedirectType.Cart)
  expect(result.url.searchParams.keys()).toContain('code')
})

test('should return product redirect if single product is present', () => {
  // Arrange
  const priceIntentId = '12345'
  const data: ShopSessionRetargetingQuery = {
    shopSession: {
      id: '123',
      cart: {
        entries: [],
        campaignsEnabled: true,
      },
      priceIntents: [
        {
          id: priceIntentId,
          product: { name: 'test' },
          data: { street: 'testgatan 1' },
          defaultOffer: FAKE_OFFER,
        },
      ],
    },
  }

  // Act
  const result = getUserRedirect(userParams, data)

  // Assert
  expect(result.type).toEqual(RedirectType.Product)
  expect(result.url.toString()).toContain(priceIntentId)
})

test('should return modified cart if multiple price intents with different exposures are present', () => {
  // Arrange
  const data: ShopSessionRetargetingQuery = {
    shopSession: {
      id: '123',
      cart: { entries: [], campaignsEnabled: true },
      priceIntents: [
        {
          id: '123',
          product: { name: 'SE_CAR' },
          data: { registrationNumber: 'FRE123' },
          defaultOffer: FAKE_OFFER,
        },
        {
          id: '456',
          product: { name: 'SE_CAR' },
          data: { registrationNumber: 'FRE456' },
          defaultOffer: FAKE_OFFER,
        },
      ],
    },
  }

  // Act
  const result = getUserRedirect(userParams, data)

  // Assert
  expect(result.type).toEqual(RedirectType.ModifiedCart)
})

const FAKE_OFFER = {
  id: '123:offer1',
  cost: {
    gross: {
      amount: 100,
    },
  },
}

test('ignore campaign code if campaigns are disabled', () => {
  const data: ShopSessionRetargetingQuery = {
    shopSession: {
      id: '123',
      cart: { entries: [], campaignsEnabled: false },
      priceIntents: [
        {
          id: '123',
          product: { name: 'SE_CAR' },
          data: { registrationNumber: 'FRE123' },
          defaultOffer: FAKE_OFFER,
        },
      ],
    },
  }
  const result = getUserRedirect(userParams, data)
  expect(result.url.searchParams.keys()).not.toContain('code')
})
