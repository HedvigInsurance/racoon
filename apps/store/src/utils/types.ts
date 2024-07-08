import { type DefaultOptions } from 'cookies-next/lib/types'
import { type cookies } from 'next/headers'

export type CookieParams = Pick<DefaultOptions, 'req' | 'res'>

// This sucks but next/headers doesn't expose the type 🤷
export type NextCookiesStore = ReturnType<typeof cookies>
