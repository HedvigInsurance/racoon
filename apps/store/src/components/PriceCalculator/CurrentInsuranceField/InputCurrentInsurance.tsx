import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, useState } from 'react'
import { Space } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { InputSwitch } from '../InputSwitch'

export type SelectOptions = ReadonlyArray<{ name: string; value: string }>

export type InputCurrentInsuranceProps = {
  label: string
  companyOptions: SelectOptions
  onCompanyChange: (company: string) => void
}

export const InputCurrentInsurance = (props: InputCurrentInsuranceProps) => {
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
