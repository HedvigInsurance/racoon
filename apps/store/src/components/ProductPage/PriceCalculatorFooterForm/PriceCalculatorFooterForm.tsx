import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import * as PriceFooter from '../PriceFooter/PriceFooter'
import { FormElement } from '../ProductPage.constants'
import { ScrollPast } from '../ScrollPast/ScrollPast'
import { ScrollToButton } from '../ScrollToButton/ScrollToButton'

type Props = {
  currencyCode: string
  price?: number
  targetRef: React.RefObject<HTMLElement>
  loading: boolean
  pricedVariantId?: string
} & React.ComponentPropsWithRef<'form'>

export const PriceCalculatorFooterForm = ({
  price,
  currencyCode,
  targetRef,
  pricedVariantId,
  loading,
  ...formProps
}: Props) => {
  const formatter = useCurrencyFormatter(currencyCode)

  const handleClick = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ScrollPast targetRef={targetRef}>
      {price ? (
        <PriceFooter.Footer>
          <form {...formProps}>
            <PriceFooter.Button type="submit" onClick={handleClick} disabled={loading}>
              <span>{formatter.format(price)}</span>
              <span>Add to cart</span>
            </PriceFooter.Button>

            <input type="hidden" name={FormElement.ProductOfferId} value={pricedVariantId} />
          </form>
        </PriceFooter.Footer>
      ) : (
        <ScrollToButton targetRef={targetRef} type="button">
          Calculate your price
        </ScrollToButton>
      )}
    </ScrollPast>
  )
}
