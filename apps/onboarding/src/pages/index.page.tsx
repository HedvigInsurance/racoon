import Link from 'next/link'
import type { NextPage } from 'next'
import { PageLink } from '@/lib/page-link'

const Home: NextPage = () => {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <h1 className="font-bold">This is a demo:</h1>
      <Link href={PageLink.forever({ code: '8batky' })}>
        <a>Forever page</a>
      </Link>
    </main>
  )
}

export default Home
