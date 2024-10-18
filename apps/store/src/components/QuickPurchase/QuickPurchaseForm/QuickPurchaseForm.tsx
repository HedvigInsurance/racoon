import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui/src/components/Button/Button'
import { Space } from 'ui'
import { ProductSelector } from './ProductSelector'
import { SsnField } from './SsnField'

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

export type FormError = Partial<Record<typeof SSN_FIELDNAME | 'general', string>>

type Props = {
  productOptions: Array<ProductOption>
  submitting?: boolean
  showSsnField?: boolean
  ssnDefaultValue?: string
  error?: FormError
}

export const QuickPurchaseForm = ({
  productOptions,
  submitting = false,
  ssnDefaultValue = '',
  showSsnField = false,
  error,
}: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <Space y={0.25}>
      {productOptions.length === 1 && (
        <input type="hidden" name={PRODUCT_FIELDNAME} value={productOptions[0].value} />
      )}
      {productOptions.length > 1 && (
        <ProductSelector
          productOptions={productOptions}
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
      {error?.general && <GeneralErrorMessage>{error.general}</GeneralErrorMessage>}
    </Space>
  )
}

const GeneralErrorMessage = styled.p({
  textAlign: 'center',
})
