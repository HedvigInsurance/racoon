import { useTranslation } from 'next-i18next'
import { useRef } from 'react'
import { Button, sprinkles, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ProductSelector } from './ProductSelector'
import {
  productSingleOption,
  stickyButton,
  stickyButtonWrapper,
  wrapper,
} from './QuickPurchaseForm.css'
import { SsnField } from './SsnField/SsnField'

export const SSN_FIELDNAME = 'ssn'
export const PRODUCT_FIELDNAME = 'product'

export type ProductOption = {
  name: string
  value: string
  img: {
    src: string
    alt?: string
  }
}

export type FormError = {
  general?: string
  ssn?: string
}

type Props = {
  productOptions: Array<ProductOption>
  productByline?: string
  defaultValue?: ProductOption['value']
  submitting?: boolean
  showSsnField?: boolean
  ssnDefaultValue?: string
  error?: FormError
}

export const QuickPurchaseForm = ({
  productOptions,
  productByline,
  defaultValue,
  submitting = false,
  ssnDefaultValue = '',
  showSsnField = false,
  error,
}: Props) => {
  const { t } = useTranslation('purchase-form')
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className={wrapper} ref={ref}>
      {productOptions.length === 1 && (
        <>
          <input type="hidden" name={PRODUCT_FIELDNAME} value={productOptions[0].value} />
          <div className={productSingleOption}>
            <Pillow size={{ _: 'xsmall', lg: 'small' }} {...productOptions[0].img} />
            <div>
              <Text>{productOptions[0].name}</Text>
              {productByline && <Text color="textSecondary">{productByline}</Text>}
            </div>
          </div>
        </>
      )}

      {productOptions.length > 1 && (
        <ProductSelector
          productOptions={productOptions}
          defaultValue={defaultValue}
          name={PRODUCT_FIELDNAME}
          disabled={submitting}
          required={true}
        />
      )}

      <SsnField
        name={SSN_FIELDNAME}
        defaultValue={ssnDefaultValue}
        required={true}
        disabled={submitting}
        warning={!!error?.ssn}
        message={error?.ssn}
        hidden={!showSsnField}
      />

      <Button type="submit" loading={submitting} fullWidth={true}>
        {t('BUTTON_LABEL_GET_PRICE')}
      </Button>

      <ScrollPast targetRef={ref}>
        <div className={stickyButtonWrapper}>
          <Button fullWidth={true} className={stickyButton}>
            {t('BUTTON_LABEL_GET_PRICE')}
          </Button>
        </div>
      </ScrollPast>

      {error?.general && <p className={sprinkles({ textAlign: 'center' })}>{error.general}</p>}
    </div>
  )
}
