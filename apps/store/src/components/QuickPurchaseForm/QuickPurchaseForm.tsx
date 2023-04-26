import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { Button, Space } from 'ui'
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
  onSubmit?: FormEventHandler<HTMLFormElement>
  loading?: boolean
  submitting?: boolean
  showSsnField?: boolean
  ssnDefaultValue?: string
  error?: FormError
}

export const QuickPurchaseForm = ({
  productOptions,
  onSubmit,
  submitting,
  ssnDefaultValue = '',
  showSsnField = false,
  error,
}: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <form onSubmit={onSubmit}>
      <Space y={0.75}>
        <Space y={0.5}>
          <SsnField
            name={SSN_FIELDNAME}
            defaultValue={ssnDefaultValue}
            required={true}
            disabled={submitting}
            warning={!!error?.ssn}
            message={error?.ssn}
            hidden={!showSsnField}
          />

          {productOptions.length > 1 && (
            <ProductSelector
              productOptions={productOptions}
              name={PRODUCT_FIELDNAME}
              disabled={submitting}
              required={true}
            />
          )}
        </Space>

        <Button type="submit" loading={submitting}>
          {t('BUTTON_LABEL_GET_PRICE')}
        </Button>

        {error?.general && <GeneralErrorMessage>{error.general}</GeneralErrorMessage>}
      </Space>
    </form>
  )
}

const GeneralErrorMessage = styled.p({
  textAlign: 'center',
})
