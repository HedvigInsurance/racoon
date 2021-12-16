import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const ForeverPage: NextPage = () => {
  const router = useRouter()
  const code = router.query.code as string

  return (
    <div>
      <main>
        <h1>
          {code}
        </h1>
      </main>
    </div>
  )
}

export default ForeverPage
