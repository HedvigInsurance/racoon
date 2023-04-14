import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { Button, Space, theme } from 'ui'
import { InputSelect, InputSelectProps } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'

export const SSN_FIELDNAME = 'ssn'
export const PRODUCT_FIELDNAME = 'product'

type Props = {
  productOptions: InputSelectProps['options']
  onSubmit?: FormEventHandler<HTMLFormElement>
  loading?: boolean
  ssnDefaultValue?: string
}

export const QuickPurchaseForm = ({
  productOptions,
  onSubmit,
  loading,
  ssnDefaultValue = '',
}: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <Wrapper>
      <form onSubmit={onSubmit}>
        <Space y={0.75}>
          <Space y={0.5}>
            <PersonalNumberField
              label={t('FIELD_SSN_SE_LABEL')}
              name={SSN_FIELDNAME}
              required={true}
              disabled={loading}
              defaultValue={ssnDefaultValue}
            />
            <InputSelect
              name={PRODUCT_FIELDNAME}
              options={productOptions}
              size="small"
              required={true}
              disabled={loading}
            />
          </Space>
          <Button type="submit" loading={loading}>
            Se ditt pris
          </Button>
        </Space>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.article({
  padding: theme.space.sm,
  borderRadius: theme.radius.xs,
  border: `1px solid ${theme.colors.gray300}`,
})
