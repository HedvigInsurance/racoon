import { yStack } from 'ui'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { layout, content } from './CheckoutPage.css'

export default function Loading() {
  return (
    <main className={layout}>
      <div className={content}>
        <section className={yStack({ gap: 'md' })}>
          <Skeleton style={{ height: 200 }} />
          <Skeleton style={{ height: 200 }} />
        </section>

        <section className={yStack({ gap: 'xl' })}>
          <Skeleton style={{ height: 500 }} />
          <Skeleton style={{ height: 180 }} />
        </section>
      </div>
    </main>
  )
}
