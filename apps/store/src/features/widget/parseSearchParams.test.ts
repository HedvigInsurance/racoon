import { describe, it, expect } from '@jest/globals'
import { parsePriceIntentDataSearchParams } from './parseSearchParams'

describe('parsePriceIntentDataSearchParams', () => {
  it('should parse price intent data search params correctly', () => {
    // Arrange
    const searchParams = new URLSearchParams()
    searchParams.set('street', '123 Main St')
    searchParams.set('zipCode', '12345')
    searchParams.set('city', 'New York')
    searchParams.set('livingSpace', '100')
    searchParams.set('coInsured', '2')

    // Act
    const [priceIntentData, remainingSearchParams] = parsePriceIntentDataSearchParams(searchParams)

    // Assert
    expect(priceIntentData).toEqual({
      street: '123 Main St',
      zipCode: '12345',
      city: 'New York',
      livingSpace: 100,
      numberCoInsured: 2,
    })
    expect(remainingSearchParams.toString()).toBe('')
  })

  it('should handle empty search params', () => {
    // Arrange
    const searchParams = new URLSearchParams()

    // Act
    const [priceIntentData, remainingSearchParams] = parsePriceIntentDataSearchParams(searchParams)

    // Assert
    expect(priceIntentData).toEqual({})
    expect(remainingSearchParams.toString()).toBe('')
  })

  it('should handle invalid values and unknown search params', () => {
    // Arrange
    const searchParams = new URLSearchParams()
    searchParams.set('street', '123 Main St')
    searchParams.set('coInsured', 'xyz')
    searchParams.set('livingSpace', 'abc')
    searchParams.set('unknown', 'xyz')

    // Act
    const [priceIntentData, remainingSearchParams] = parsePriceIntentDataSearchParams(searchParams)

    // Assert
    expect(priceIntentData).toEqual({ street: '123 Main St' })
    expect(remainingSearchParams.toString()).toBe('coInsured=xyz&livingSpace=abc&unknown=xyz')
  })
})
