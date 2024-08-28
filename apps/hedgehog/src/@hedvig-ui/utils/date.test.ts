import { BirthDayInfo, getBirthdayInfo } from '@hedvig-ui'

it('Returns null if invalid birth date string', () => {
  const today = new Date('2021-04-29')
  const birthDateString = '1994/04/31'
  const birthDateInfo = getBirthdayInfo(birthDateString, today)
  expect(birthDateInfo).toBe(null)
})

it('Returns BirthDayInfo.Today if birth date is today', () => {
  const today = new Date('2021-04-29')
  const birthDateString = '1994-04-29'
  const birthDateInfo = getBirthdayInfo(birthDateString, today)
  expect(birthDateInfo).toBe(BirthDayInfo.Today)
})

it('Returns BirthDayInfo.Tomorrow if birth date is tomorrow', () => {
  const today = new Date('2021-04-29')
  const birthDateString = '1994-04-30'
  const birthDateInfo = getBirthdayInfo(birthDateString, today)
  expect(birthDateInfo).toBe(BirthDayInfo.Tomorrow)
})

it('Returns BirthDayInfo.Yesterday if birth date is yesterday', () => {
  const today = new Date('2021-04-29')
  const birthDateString = '1994-04-28'
  const birthDateInfo = getBirthdayInfo(birthDateString, today)
  expect(birthDateInfo).toBe(BirthDayInfo.Yesterday)
})

it('Returns null if birth date is neither yesterday, today or tomorrow', () => {
  const today = new Date('2021-04-29')
  const birthDateString = '1994-08-11'
  const birthDateInfo = getBirthdayInfo(birthDateString, today)
  expect(birthDateInfo).toBe(null)
})

it('Returns BirthDayInfo.Tomorrow if birth date is tomorrow in next year', () => {
  const today = new Date('2021-12-31')
  const birthDateString = '1994-01-01'
  const birthDateInfo = getBirthdayInfo(birthDateString, today)
  expect(birthDateInfo).toBe(BirthDayInfo.Tomorrow)
})

it('Returns BirthDayInfo.Yesterday if birth date is yesterday in previous year', () => {
  const today = new Date('2021-01-01')
  const birthDateString = '1994-12-31'
  const birthDateInfo = getBirthdayInfo(birthDateString, today)
  expect(birthDateInfo).toBe(BirthDayInfo.Yesterday)
})
