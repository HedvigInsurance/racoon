import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useCallback, useState } from 'react'
import { ChangeSsnWarningDialog } from '@/components/ChangeSsnWarningDialog/ChangeSsnWarningDialog'
import {
  PersonalNumberField,
  Props as PersonalNumberFieldProps,
} from '@/components/PersonalNumberField/PersonalNumberField'

type Props = Omit<PersonalNumberFieldProps, 'label'> & { label?: string }

export const SsnField = (props: Props) => {
  const [showChangeSsnDialog, setShowChangeSsnDialog] = useState(false)
  const { t } = useTranslation('purchase-form')

  const openChangeSsnDialog = useCallback(() => {
    setShowChangeSsnDialog(true)
  }, [setShowChangeSsnDialog])

  const closeChangeSsnDialog = useCallback(() => {
    setShowChangeSsnDialog(false)
  }, [setShowChangeSsnDialog])

  const label = t('FIELD_SSN_SE_LABEL')

  if (props.defaultValue) {
    return (
      <>
        <SsnFieldWrapper>
          <PersonalNumberField
            {...props}
            label={label}
            name={props.name}
            value={props.defaultValue}
            readOnly={true}
            onClear={openChangeSsnDialog}
          />
        </SsnFieldWrapper>

        <ChangeSsnWarningDialog
          open={showChangeSsnDialog}
          onAccept={closeChangeSsnDialog}
          onDecline={closeChangeSsnDialog}
        />
      </>
    )
  }

  return <PersonalNumberField label={label} {...props} />
}

const SsnFieldWrapper = styled.div({
  flex: 1,
})
