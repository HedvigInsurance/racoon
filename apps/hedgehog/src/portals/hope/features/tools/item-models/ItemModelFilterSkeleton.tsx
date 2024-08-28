import { Button } from '@hedvig-ui'

export const ItemModelFilterSkeleton = () => {
  const skeletonArray = Array(4).fill(
    Array(Math.floor(Math.random() * 10 + 6)).fill('1'),
  )
  return (
    <>
      {skeletonArray.map((skeletonButtonText, index) => (
        <Button
          key={index}
          variant="tertiary"
          style={{ marginInline: index === 0 ? '' : '0.5rem' }}
        >
          {skeletonButtonText}
        </Button>
      ))}
    </>
  )
}
