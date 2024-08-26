import { type cookies } from 'next/headers'

// GOTCHA: Mad type less safe as a workaround to typecheck error that only happens when building on Vercel
//
// Original variant:
// import { type OptionsType } from 'cookies-next/lib/types'
// export type CookieParams = { Pick<OptionsType, 'req' | 'res'> }
export type CookieParams = {
  req?: any
  res?: any
}

// This sucks but next/headers doesn't expose the type 🤷
export type NextCookiesStore = ReturnType<typeof cookies>
