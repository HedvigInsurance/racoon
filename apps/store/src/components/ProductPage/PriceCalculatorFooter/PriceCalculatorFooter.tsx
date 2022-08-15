import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import * as PriceFooter from '../PriceFooter/PriceFooter'
import { ScrollPast } from '../ScrollPast/ScrollPast'
import { ScrollToButton } from '../ScrollToButton/ScrollToButton'

type Props = {
  currencyCode: string
  price?: number
  targetRef: React.RefObject<HTMLElement>
  onClickAddToCart: () => void
}

export const PriceCalculatorFooter = ({
  price,
  currencyCode,
  targetRef,
  onClickAddToCart,
}: Props) => {
  const formatter = useCurrencyFormatter(currencyCode)

  const handleClick = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' })
    onClickAddToCart()
  }

  return (
    <ScrollPast targetRef={targetRef}>
      {price ? (
        <PriceFooter.Footer>
          <PriceFooter.Button onClick={handleClick}>
            <span>{formatter.format(price)}</span>
            <span>Add to cart</span>
          </PriceFooter.Button>
        </PriceFooter.Footer>
      ) : (
        <ScrollToButton targetRef={targetRef}>Calculate your price</ScrollToButton>
      )}
    </ScrollPast>
  )
}
