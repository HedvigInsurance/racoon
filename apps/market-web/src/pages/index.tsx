import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <h1>
          This is a demo
        </h1>

        <p>
          Check out the <Link href="/se/press"><a>Press</a></Link> page.
        </p>
      </main>
    </div>
  )
}

export default Home
