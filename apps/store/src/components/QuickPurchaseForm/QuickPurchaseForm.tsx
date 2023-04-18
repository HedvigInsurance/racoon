import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { Button, Space, theme } from 'ui'
import { useGetDiscountExplanation } from '@/components/CartInventory/CartInventory.helpers'
import { InputSelect, InputSelectProps } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { RedeemedCampaign } from '@/services/apollo/generated'

export const SSN_FIELDNAME = 'ssn'
export const PRODUCT_FIELDNAME = 'product'

type Props = {
  productOptions: InputSelectProps['options']
  onSubmit?: FormEventHandler<HTMLFormElement>
  loading?: boolean
  ssnDefaultValue?: string
  redeemedCampaign?: RedeemedCampaign
}

export const QuickPurchaseForm = ({
  productOptions,
  onSubmit,
  loading,
  ssnDefaultValue = '',
  redeemedCampaign,
}: Props) => {
  const { t } = useTranslation('purchase-form')
  const getDiscountExplanation = useGetDiscountExplanation()

  return (
    <Wrapper y={0.75}>
      {redeemedCampaign && (
        <Space y={0.75}>
          <CampaignCodeBadge>{redeemedCampaign.code}</CampaignCodeBadge>
          <p>{getDiscountExplanation(redeemedCampaign.discount)}</p>
        </Space>
      )}
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

const Wrapper = styled(Space)({
  padding: theme.space.sm,
  borderRadius: theme.radius.xs,
  border: `1px solid ${theme.colors.gray300}`,
})

const CampaignCodeBadge = styled.span({
  borderRadius: theme.radius.xs,
  backgroundColor: theme.colors.gray200,
  textTransform: 'uppercase',
  padding: `${theme.space.xxs} ${theme.space.xs}`,
})
