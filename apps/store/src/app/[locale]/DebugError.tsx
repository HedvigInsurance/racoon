'use client'
import { useSearchParams } from 'next/navigation'

export const DebugError = () => {
  const searchParams = useSearchParams()
  if (process.env.VERCEL_ENV !== 'production' && searchParams?.get('rootError')) {
    throw new Error('root layout error')
  }
  return null
}
