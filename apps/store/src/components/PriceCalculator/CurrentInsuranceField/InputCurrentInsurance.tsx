import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, useState } from 'react'
import { Space } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'
import * as RadioGroup from './RadioGroup'

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
  const { highlight, animationProps } = useHighlightAnimation()
  const [hasInsurance, setHasInsurance] = useState(!!company)

  const handleRadioValueChange = (newValue: string) => {
    highlight()
    setHasInsurance(newValue === RadioOption.YES)
  }

  const handleChangeExternalInsurer: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onCompanyChange(event.target.value || undefined)
  }

  return (
    <Space y={0.25}>
      <Card y={0.75} {...animationProps}>
        <Text as="p" size="l">
          {label}
        </Text>

        <RadioGroup.Root
          value={hasInsurance ? RadioOption.YES : RadioOption.NO}
          onValueChange={handleRadioValueChange}
        >
          <SpaceFlex space={1} align="center">
            <SpaceFlex space={0.5} align="center">
              <RadioGroup.Item id={RadioOption.YES} value={RadioOption.YES}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor={RadioOption.YES}>{t('LABEL_YES')}</label>
            </SpaceFlex>

            <SpaceFlex space={0.5} align="center">
              <RadioGroup.Item id={RadioOption.NO} value={RadioOption.NO}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label htmlFor={RadioOption.NO}>{t('LABEL_NO')}</label>
            </SpaceFlex>
          </SpaceFlex>
        </RadioGroup.Root>
      </Card>

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

const Card = styled(motion(Space))(({ theme }) => ({
  padding: `${theme.space[3]} ${theme.space[4]}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray300,
}))
