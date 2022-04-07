import { MarketLabel } from './locales'

type PhoneNumbers = Partial<Record<MarketLabel, PhoneNumberData>>

export type PhoneNumberData = {
  displayNumber: string
  hrefNumber: string
  opensAt: string
  closesAt: string
  lunchStartsAt: string
  lunchEndsAt: string
}

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
