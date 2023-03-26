import { cookies } from 'next/headers'
import Link from 'next/link'
import { COOKIE_KEY_SHOP_SESSION } from '@/services/shopSession/ShopSession.constants'
import { Form } from './form'

export const metadata = {
  robots: 'none',
}

const Page = () => {
  const cookieStore = cookies()
  const shopSessionId = cookieStore.get(COOKIE_KEY_SHOP_SESSION)?.value

  return (
    <div>
      <h1>Debugger</h1>
      <section>
        <h2>Create new shop session</h2>
        <Form />
      </section>
      <section>
        <h2>Get shop session</h2>
        <Link href={`/debugger/shop-sessions?id=${shopSessionId}`}>Current shop session</Link>
      </section>
    </div>
  )
}

export default Page
