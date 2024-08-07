import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import type { ChangeEventHandler } from 'react'
import { useState } from 'react'
import { Space } from 'ui'
import { InputRadio } from '@/components/InputRadio/InputRadio'
import { InputSelect } from '@/components/InputSelect/InputSelect'

export type SelectOptions = ReadonlyArray<{ name: string; value: string }>

enum RadioOption {
  YES = 'YES',
  NO = 'NO',
}

export type InputCurrentInsuranceProps = {
  label: string
  company?: string
  companyOptions: SelectOptions
  onCompanyChange: (company?: string) => void
}

export const InputCurrentInsurance = (props: InputCurrentInsuranceProps) => {
  const { label, company, companyOptions, onCompanyChange } = props
  const { t } = useTranslation('purchase-form')
  const [hasInsurance, setHasInsurance] = useState(!!company)

  const handleRadioValueChange = (newValue: string) => {
    const newValueEnum = newValue as RadioOption

    datadogRum.addAction('Select HasInsurance', { value: newValueEnum })
    if (newValueEnum === RadioOption.NO) onCompanyChange(undefined)
    setHasInsurance(newValueEnum === RadioOption.YES)
  }

  const handleChangeExternalInsurer: ChangeEventHandler<HTMLSelectElement> = (event) => {
    datadogRum.addAction('Select ExternalInsurer', { value: event.target.value })
    onCompanyChange(event.target.value || undefined)
  }

  return (
    <Space y={0.25}>
      <InputRadio
        label={label}
        value={hasInsurance ? RadioOption.YES : RadioOption.NO}
        onValueChange={handleRadioValueChange}
        options={[
          { label: t('LABEL_YES'), value: RadioOption.YES },
          { label: t('LABEL_NO'), value: RadioOption.NO },
        ]}
      />

      {hasInsurance && (
        <InputSelect
          name="externalInsurer"
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
