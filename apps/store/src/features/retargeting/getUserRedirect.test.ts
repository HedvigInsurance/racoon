import { describe, it, expect } from '@jest/globals'
import { ShopSessionRetargetingQuery } from '@/services/apollo/generated'
import { RedirectType, getUserRedirect } from './getUserRedirect'
import { UserParams } from './retargeting.types'

describe('getUserRedirect', () => {
  const userParams: UserParams = { shopSessionId: '123', locale: 'se', queryParams: [] }

  it('should return fallback redirect if no data is provided', () => {
    // Arrange
    const data = null

    // Act
    const result = getUserRedirect(userParams, data)

    // Assert
    expect(result.type).toEqual(RedirectType.Fallback)
  })

  it('should return cart redirect if cart is not empty', () => {
    // Arrange
    const data: ShopSessionRetargetingQuery = {
      shopSession: {
        id: '123',
        cart: {
          entries: [{ id: '123:offer1' }],
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
  })

  it('should return product redirect if single product is present', () => {
    // Arrange
    const priceIntentId = '12345'
    const data: ShopSessionRetargetingQuery = {
      shopSession: {
        id: '123',
        cart: {
          entries: [],
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

  it('should return product redirect for multiple price intents with the same exposure', () => {
    // Arrange
    const priceIntentId = '12345'
    const data: ShopSessionRetargetingQuery = {
      shopSession: {
        id: '123',
        cart: { entries: [] },
        priceIntents: [
          {
            id: '123',
            product: { name: 'SE_CAR' },
            data: { registrationNumber: 'FRE123' },
            defaultOffer: FAKE_OFFER,
          },
          {
            id: priceIntentId,
            product: { name: 'SE_CAR' },
            data: { registrationNumber: 'FRE123' },
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

  it('should return modified cart if multiple price intents with different exposures are present', () => {
    // Arrange
    const data: ShopSessionRetargetingQuery = {
      shopSession: {
        id: '123',
        cart: { entries: [] },
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
})

const FAKE_OFFER = {
  id: '123:offer1',
  cost: {
    gross: {
      amount: 100,
    },
  },
}
