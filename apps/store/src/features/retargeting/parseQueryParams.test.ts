import { FALLBACK_LOCALE, locales } from '@/utils/l10n/locales'
import { parseQueryParams } from './parseQueryParams'
import { QueryParam } from './retargeting.constants'

describe('parseQueryParams', () => {
  test('should return null if shop session is not included', () => {
    // Arrange
    const query = { [QueryParam.Locale]: 'se', [QueryParam.CampaignCode]: 'ANICEDEAL' }

    // Act
    const result = parseQueryParams(query)

    // Assert
    expect(result).toBeNull()
  })

  test('should parse query params correctly', () => {
    // Arrange
    const query = {
      [QueryParam.ShopSession]: '123',
      [QueryParam.Locale]: 'se',
      [QueryParam.CampaignCode]: 'ANICEDEAL',
    }

    // Act
    const result = parseQueryParams(query)

    // Assert
    expect(result).toEqual({
      shopSessionId: query[QueryParam.ShopSession],
      locale: query[QueryParam.Locale],
      campaignCode: query[QueryParam.CampaignCode],
    })
  })

  test('should return fallback locale unless it is included', () => {
    // Arrange
    const query = { [QueryParam.ShopSession]: '123' }

    // Act
    const result = parseQueryParams(query)

    // Assert
    expect(result?.locale).toEqual(locales[FALLBACK_LOCALE].routingLocale)
  })

  test('should return fallback locale if included locale is not valid', () => {
    // Arrange
    const query = { [QueryParam.ShopSession]: '123', [QueryParam.Locale]: 'invalid' }

    // Act
    const result = parseQueryParams(query)

    // Assert
    expect(result?.locale).toEqual(locales[FALLBACK_LOCALE].routingLocale)
  })
})
