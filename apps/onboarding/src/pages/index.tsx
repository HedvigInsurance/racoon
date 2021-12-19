import type { NextPage } from 'next'
import Link from 'next/link'
import { PageLink } from '@/lib/page-link'

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <h1>
          This is a demo
        </h1>

        <Link href={PageLink.forever({ code: '335FVT' })}>Forever page</Link>
      </main>
    </div>
  )
}

export default Home
