import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import * as PriceFooter from '../PriceFooter/PriceFooter'
import { ScrollPast } from '../ScrollPast/ScrollPast'
import { ScrollToButton } from '../ScrollToButton/ScrollToButton'

type Props = {
  currencyCode: string
  price?: number
  targetRef: React.RefObject<HTMLElement>
  loading: boolean
} & React.ComponentPropsWithRef<'form'>

export const PriceCalculatorFooterForm = ({
  price,
  currencyCode,
  targetRef,
  ...formProps
}: Props) => {
  const formatter = useCurrencyFormatter(currencyCode)

  const handleClick = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ScrollPast targetRef={targetRef}>
      <form {...formProps}>
        {price ? (
          <PriceFooter.Footer>
            <PriceFooter.Button type="submit" onClick={handleClick}>
              <span>{formatter.format(price)}</span>
              <span>Add to cart</span>
            </PriceFooter.Button>
          </PriceFooter.Footer>
        ) : (
          <ScrollToButton targetRef={targetRef} type="button">
            Calculate your price
          </ScrollToButton>
        )}
      </form>
    </ScrollPast>
  )
}
