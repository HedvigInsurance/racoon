import { ActionInput, Store } from '../types'
import { TextAction, TextActionMask } from '@/shared/types'
import { differenceInYears, parse as parseDate } from 'date-fns'

import invariant from 'tiny-invariant'

type Params = {
  action: TextAction
  input: ActionInput
}

const BIRTH_DATE_REGEX = /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const BIRTH_DATE_PATTERN = 'yyyy-MM-dd'
const BIRTH_DATE_REVERSE_REGEX = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-[12]\d{3}$/
const BIRTH_DATE_PATTERN_REVERSE = 'dd-MM-yyyy'

const parseBirthDateAge = (value: string, pattern: string) => {
  const dateOfBirth = parseDate(value, pattern, 0)
  return differenceInYears(new Date(), dateOfBirth)
}

export const parseTextActionInput = ({ action, input }: Params): Store => {
  const value = input.data.value
  invariant(typeof value === 'string')

  const storeDiff: Store = {
    [action.key]: value,
  }

  if (action.mask === TextActionMask.BirthDate) {
    invariant(BIRTH_DATE_REGEX.test(value))
    storeDiff[`${action.key}.Age`] = parseBirthDateAge(value, BIRTH_DATE_PATTERN)
  } else if (action.mask === TextActionMask.BirthDateReverse) {
    invariant(BIRTH_DATE_REVERSE_REGEX.test(value))
    storeDiff[`${action.key}.Age`] = parseBirthDateAge(value, BIRTH_DATE_PATTERN_REVERSE)
  }

  return storeDiff
}
