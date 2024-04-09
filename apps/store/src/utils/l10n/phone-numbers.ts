import type { CountryLabel } from './types'

type PhoneNumbers = Partial<Record<CountryLabel, PhoneNumberData>>

export type PhoneNumberData = {
  displayNumber: string
  hrefNumber: string
  opensAt: string
  closesAt: string
  lunchStartsAt: string
  lunchEndsAt: string
}

// TODO: Unused. Do we need it?
export const phoneNumbers: PhoneNumbers = {
  SE: {
    displayNumber: '075-101 20 00',
    hrefNumber: 'tel:0751012000',
    opensAt: '09',
    closesAt: '18',
    lunchStartsAt: '12',
    lunchEndsAt: '13',
  },
}
