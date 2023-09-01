import { ShopSessionRetargetingQuery } from '@/services/apollo/generated'
import { RedirectType, getUserRedirect } from './getUserRedirect'
import { UserParams } from './retargeting.types'

describe('getUserRedirect', () => {
  const userParams: UserParams = { shopSessionId: '123', locale: 'se' }

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
          entries: [{ id: '123' }],
        },
        priceIntents: [{ id: '123', product: { name: 'test' } }],
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
        priceIntents: [{ id: priceIntentId, product: { name: 'test' } }],
      },
    }

    // Act
    const result = getUserRedirect(userParams, data)

    // Assert
    expect(result.type).toEqual(RedirectType.Product)
    expect(result.url).toContain(priceIntentId)
  })
})
