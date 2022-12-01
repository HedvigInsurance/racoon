import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, useState } from 'react'
import { Space } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { InputSwitch } from '../InputSwitch'

export type SelectOptions = ReadonlyArray<{ name: string; value: string }>

export type InputCurrentInsuranceProps = {
  label: string
  company?: string
  companyOptions: SelectOptions
  onCompanyChange: (company?: string) => void
}

export const InputCurrentInsurance = (props: InputCurrentInsuranceProps) => {
  const { label, company, companyOptions, onCompanyChange } = props
  const [hasInsurance, setHasInsurance] = useState(false)

  const handleCheckedChange = (checked: boolean) => {
    setHasInsurance(checked)
  }

  const { t } = useTranslation('purchase-form')

  const handleChangeExternalInsurer: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onCompanyChange(event.target.value || undefined)
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
          value={company}
          onChange={handleChangeExternalInsurer}
        />
      )}
    </Space>
  )
}
