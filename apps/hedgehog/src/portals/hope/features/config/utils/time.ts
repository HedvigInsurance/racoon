const ONE_SECOND = 1000

export const plusHours = (base: Date, hours: number) =>
  new Date(base.getTime() + ONE_SECOND * 60 * 60 * hours)
export const plusMinutes = (base: Date, minutes: number) =>
  new Date(base.getTime() + ONE_SECOND * 60 * minutes)
export const plusSeconds = (base: Date, seconds: number) =>
  new Date(base.getTime() + ONE_SECOND * seconds)

export const inTenMinutes = plusMinutes(new Date(), 10)
