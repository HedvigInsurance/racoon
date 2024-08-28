import {
  convertCamelcaseToTitle,
  convertEnumOrSentenceToTitle,
  convertEnumToTitle,
  formatPostalCode,
} from '@hedvig-ui'

it('convertEnumToTitle converts enum text to Title', () => {
  expect(convertEnumToTitle('MY_ENUM')).toBe('My Enum')
})

it('convertEnumOrSentenceToTitle converts enum text to Title', () => {
  expect(convertEnumOrSentenceToTitle('MY_ENUM')).toBe('My Enum')
})

it('convertEnumOrSentenceToTitle converts sentence text to Title', () => {
  expect(convertEnumOrSentenceToTitle('My sentence')).toBe('My Sentence')
})

it('convertEnumOrSentenceToTitle converts Swedish sentence text to Title', () => {
  expect(convertEnumOrSentenceToTitle('Martin hövding 23')).toBe(
    'Martin Hövding 23',
  )
})

it('formats Swedish postal code', () => {
  expect(formatPostalCode('12345')).toBe('123 45')
})

it('formats Norwegian postal code', () => {
  expect(formatPostalCode('1234')).toBe('1234')
})

it('converts camelCase to Title', () => {
  expect(convertCamelcaseToTitle('camelCase')).toBe('Camel Case')
})

it('does not convert Title', () => {
  expect(convertCamelcaseToTitle('Camel Case')).toBe('Camel Case')
})
