import { useTranslation } from 'next-i18next'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import * as PriceFooter from '../PriceFooter/PriceFooter'
import { FormElement } from '../ProductPage.constants'
import { ScrollPast } from '../ScrollPast/ScrollPast'

type Props = {
  currencyCode: string
  price: number
  targetRef: React.RefObject<HTMLElement>
  loading: boolean
  productOfferId: string
} & React.ComponentPropsWithRef<'form'>

export const PriceCalculatorFooterForm = ({
  price,
  currencyCode,
  targetRef,
  productOfferId,
  loading,
  ...formProps
}: Props) => {
  const { t } = useTranslation()
  const formatter = useCurrencyFormatter(currencyCode)

  const handleClick = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ScrollPast targetRef={targetRef}>
      <PriceFooter.Footer>
        <form {...formProps}>
          <PriceFooter.Button type="submit" onClick={handleClick} disabled={loading}>
            <span>{t('MONTHLY_PRICE', { displayAmount: formatter.format(price) })}</span>
            <span>Add to cart</span>
          </PriceFooter.Button>

          <input type="hidden" name={FormElement.ProductOfferId} value={productOfferId} />
        </form>
      </PriceFooter.Footer>
    </ScrollPast>
  )
}
