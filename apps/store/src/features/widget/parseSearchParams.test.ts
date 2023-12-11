import { describe, it, expect } from '@jest/globals'
import { parsePriceIntentDataSearchParams, parseProductNameSearchParams } from './parseSearchParams'

describe('parsePriceIntentDataSearchParams', () => {
  it('should parse price intent data search params correctly', () => {
    // Arrange
    const searchParams = new URLSearchParams()
    searchParams.set('street', '123 Main St')
    searchParams.set('zipCode', '12345')
    searchParams.set('city', 'New York')
    searchParams.set('livingSpace', '100')
    searchParams.set('numberCoInsured', '2')

    // Act
    const [priceIntentData, remainingSearchParams] = parsePriceIntentDataSearchParams(searchParams)

    // Assert
    expect(priceIntentData).toEqual({
      street: '123 Main St',
      zipCode: '12345',
      livingSpace: 100,
      numberCoInsured: 2,
    })
    expect(remainingSearchParams.toString()).toBe('city=New+York')
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
    searchParams.set('numberCoInsured', 'xyz')
    searchParams.set('livingSpace', 'abc')
    searchParams.set('unknown', 'xyz')

    // Act
    const [priceIntentData, remainingSearchParams] = parsePriceIntentDataSearchParams(searchParams)

    // Assert
    expect(priceIntentData).toEqual({ street: '123 Main St' })
    expect(remainingSearchParams.toString()).toBe('numberCoInsured=xyz&livingSpace=abc&unknown=xyz')
  })

  it('should handle boolean values', () => {
    // Arrange
    const searchParams = new URLSearchParams()
    searchParams.set('isStudent', '1')

    // Act
    const [priceIntentData, remainingSearchParams] = parsePriceIntentDataSearchParams(searchParams)

    // Assert
    expect(priceIntentData).toEqual({ isStudent: true })
    expect(remainingSearchParams.toString()).toBe('')
  })

  it('should handle legacy parameters', () => {
    // Arrange
    const searchParams = new URLSearchParams()
    searchParams.set('street', '123 Main St')
    searchParams.set('student', 'yes')
    searchParams.set('coInsured', '2')

    // Act
    const [priceIntentData, remainingSearchParams] = parsePriceIntentDataSearchParams(searchParams)

    // Assert
    expect(priceIntentData).toEqual({ street: '123 Main St', isStudent: true, numberCoInsured: 2 })
    expect(remainingSearchParams.toString()).toBe('')
  })

  it('should handle legacy product parameters', () => {
    // Arrange
    const searchParams = new URLSearchParams()
    searchParams.set('productType', 'SWEDISH_APARTMENT')
    searchParams.set('subType', 'BRF')

    // Act
    const [productName] = parseProductNameSearchParams(searchParams)

    // Assert
    expect(productName).toBe('SE_APARTMENT_BRF')
  })

  it('should handle mixed legacy and new product parameters', () => {
    // Arrange
    const searchParams = new URLSearchParams()
    searchParams.set('productType', 'SWEDISH_APARTMENT')
    searchParams.set('subType', 'BRF')
    searchParams.set('productName', 'SE_APARTMENT_RENT')

    // Act
    const [productName] = parseProductNameSearchParams(searchParams)

    // Assert
    expect(productName).toBe('SE_APARTMENT_RENT')
  })
})
