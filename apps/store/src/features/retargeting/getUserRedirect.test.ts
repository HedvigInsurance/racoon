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
          entries: [{ id: '123:offer1' }],
        },
        priceIntents: [
          {
            id: '123',
            product: { name: 'test' },
            offers: [
              {
                id: '123:offer1',
                cost: {
                  gross: {
                    amount: 100,
                  },
                },
              },
            ],
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
        priceIntents: [{ id: priceIntentId, product: { name: 'test' }, offers: [] }],
      },
    }

    // Act
    const result = getUserRedirect(userParams, data)

    // Assert
    expect(result.type).toEqual(RedirectType.Product)
    expect(result.url).toContain(priceIntentId)
  })

  describe('when multiple quotes are present but none are added into the cart', () => {
    it('should return a modified cart redirect containing the ids of the cheapest offers for every product', () => {
      // Arrange
      const data: ShopSessionRetargetingQuery = {
        shopSession: {
          id: '123',
          cart: {
            entries: [],
          },
          priceIntents: [
            {
              id: '123',
              product: { name: 'product1' },
              offers: [
                {
                  id: '123:offer1',
                  cost: {
                    gross: {
                      amount: 100,
                    },
                  },
                },
                {
                  id: '123:offer2',
                  cost: {
                    gross: {
                      amount: 200,
                    },
                  },
                },
              ],
            },
            {
              id: '456',
              product: { name: 'product2' },
              offers: [
                {
                  id: '456:offer1',
                  cost: {
                    gross: {
                      amount: 200,
                    },
                  },
                },
                {
                  id: '456:offer2',
                  cost: {
                    gross: {
                      amount: 150,
                    },
                  },
                },
              ],
            },
          ],
        },
      }

      // Act
      const result = getUserRedirect(userParams, data) as Extract<
        ReturnType<typeof getUserRedirect>,
        { type: RedirectType.ModifiedCart }
      >

      // Assert
      expect(result.type).toEqual(RedirectType.ModifiedCart)
      expect(result.offers).toEqual(expect.arrayContaining(['123:offer1', '456:offer2']))
    })
  })
})
