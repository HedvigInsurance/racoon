import { Button, yStack } from 'ui'
import { ProductHeroContainer } from '@/components/ProductPage/PurchaseForm/ProductHeroContainer'
import { ProductAverageRating } from '@/components/ProductReviews/ProductAverageRating'

export function PurchaseFormPillow(props: {
  loading?: boolean
  onClick?: () => void
  showAverageRating?: boolean
  buttonLabel: string
}) {
  return (
    <ProductHeroContainer size="large">
      <div className={yStack({ gap: 'md' })}>
        <Button loading={props.loading} onClick={props.onClick} fullWidth={true}>
          {props.buttonLabel}
        </Button>
        {props.showAverageRating && <ProductAverageRating />}
      </div>
    </ProductHeroContainer>
  )
}
