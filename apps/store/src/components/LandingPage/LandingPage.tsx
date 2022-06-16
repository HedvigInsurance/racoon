import Link from 'next/link'
import { PageLink } from '@/lib/PageLink'

export const LandingPage = () => {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link href={PageLink.store()}>Go to store</Link>
    </div>
  )
}
