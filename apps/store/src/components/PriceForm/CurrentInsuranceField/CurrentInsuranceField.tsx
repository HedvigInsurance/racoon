import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, useState } from 'react'
import { Space } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { InputSwitch } from '../InputSwitch'
import { SelectOptions } from './CurrentInsuranceField.types'

export type CurrentInsuranceFieldProps = {
  label: string
  companyOptions: SelectOptions
  onCompanyChange: (company: string) => void
}

export const CurrentInsuranceField = (props: CurrentInsuranceFieldProps) => {
  const { companyOptions, onCompanyChange, label } = props
  const [hasInsurance, setHasInsurance] = useState(false)

  const handleCheckedChange = (checked: boolean) => {
    setHasInsurance(checked)
  }

  const { t } = useTranslation('purchase-form')

  const handleChangeExternalInsurer: ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (event.target.value) {
      onCompanyChange(event.target.value)
    }
  }

  return (
    <Space y={1}>
      <InputSwitch label={label} checked={hasInsurance} onCheckedChange={handleCheckedChange} />

      {hasInsurance && (
        <InputSelect
          name="externalInsurer"
          // @TODO: remove, not part of updated designs
          label="Current insurance company"
          required
          options={companyOptions}
          placeholder={t('CURRENT_INSURANCE_FIELD_PLACEHOLDER')}
          onChange={handleChangeExternalInsurer}
        />
      )}
    </Space>
  )
}
