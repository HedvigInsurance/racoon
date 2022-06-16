import Link from 'next/link'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { PageLink } from '@/lib/PageLink'

export const LandingPage = () => {
  const { locale } = useCurrentLocale()
  return (
    <div>
      <h1>Landing Page</h1>
      <Link href={PageLink.store({ locale })}>Go to store</Link>
    </div>
  )
}
