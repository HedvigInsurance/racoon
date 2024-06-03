import { Skeleton } from '@/components/Skeleton/Skeleton'

export default function PageLoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '0.5rem', padding: '1rem' }}>
      <Skeleton style={{ height: '4rem' }} />
      <Skeleton style={{ height: '8rem' }} />
      <Skeleton style={{ height: '8rem' }} />
      <Skeleton style={{ height: '8rem' }} />
    </div>
  )
}
