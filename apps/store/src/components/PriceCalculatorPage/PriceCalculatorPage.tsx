import { Suspense } from 'react'
import { xStack } from 'ui'
import { PriceCalculatorNew } from '@/components/PriceCalculatorPage/PriceCalculatorNew'
import { Skeleton } from '@/components/Skeleton/Skeleton'

// TODO: Convert to vanilla styles when we get to look and feel part
export function PriceCalculatorPage() {
  return (
    <div
      className={xStack({})}
      style={{ maxHeight: '100vh', overflow: 'auto', backgroundColor: 'white', gap: 'initial' }}
    >
      <div
        style={{
          backgroundColor: 'lightblue',
          position: 'sticky',
          top: 0,
          width: '50%',
          height: 'fit-content',
          minHeight: '100vh',
        }}
      >
        TODO: background media
      </div>
      <div style={{ minHeight: '300vh', width: '50%', flexGrow: 1, padding: '1rem' }}>
        <Suspense fallback={<Skeleton style={{ height: '100vh' }} />}>
          <PriceCalculatorNew />
        </Suspense>
      </div>
    </div>
  )
}
