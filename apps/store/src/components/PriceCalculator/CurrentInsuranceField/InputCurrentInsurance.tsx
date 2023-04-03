import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, useState } from 'react'
import { Space } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import * as InputRadio from '../InputRadio'

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
    datadogRum.addAction('Select HasInsurance', { value: newValue })
    if (newValue === RadioOption.NO) onCompanyChange(undefined)
    setHasInsurance(newValue === RadioOption.YES)
  }

  const handleChangeExternalInsurer: ChangeEventHandler<HTMLSelectElement> = (event) => {
    datadogRum.addAction('Select ExternalInsurer', { value: event.target.value })
    onCompanyChange(event.target.value || undefined)
  }

  return (
    <Space y={0.25}>
      <InputRadio.Root
        label={label}
        value={hasInsurance ? RadioOption.YES : RadioOption.NO}
        onValueChange={handleRadioValueChange}
      >
        <InputRadio.Item label={t('LABEL_YES')} value={RadioOption.YES} />
        <InputRadio.Item label={t('LABEL_NO')} value={RadioOption.NO} />
      </InputRadio.Root>

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
