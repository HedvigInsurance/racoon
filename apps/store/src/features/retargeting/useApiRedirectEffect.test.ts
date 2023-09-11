import { QueryParam } from './retargeting.constants'
import { getApiRedirect } from './useApiRedirectEffect'

describe('getApiRedirect', () => {
  test('should return fallback if the shop session ID is missing', () => {
    // Arrange
    const url = 'https://www.example.com?shopSession=123'

    // Act
    const result = getApiRedirect(url, 'se')

    // Assert
    expect(result.type).toEqual('fallback')
  })

  test('should return api route if the shop session ID is present', () => {
    // Arrange
    const shopSessionId = '12345'
    const url = `https://www.example.com?${QueryParam.ShopSession}=${shopSessionId}`

    // Act
    const result = getApiRedirect(url, 'se')

    // Assert
    expect(result.type).toEqual('api')
    expect(result.url.pathname).toContain(shopSessionId)
  })

  test('should forward query params to the api route', () => {
    // Arrange
    const shopSessionId = '12345'
    const url = `https://www.example.com?${QueryParam.ShopSession}=${shopSessionId}&foo=bar`

    // Act
    const result = getApiRedirect(url, 'se')

    // Assert
    expect(result.url.searchParams.get('foo')).toEqual('bar')
  })
})
