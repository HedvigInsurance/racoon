import { useTranslation } from 'next-i18next'
import { type MouseEventHandler, useCallback, useState } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { sprinkles, Text } from 'ui'
import { ChangeSsnWarningDialog } from '@/components/ChangeSsnWarningDialog/ChangeSsnWarningDialog'
import type { Props as PersonalNumberFieldProps } from '@/components/PersonalNumberField/PersonalNumberField'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { useFormatter } from '@/utils/useFormatter'
import { fakeInput } from './SsnField.css'

type Props = Omit<PersonalNumberFieldProps, 'label' | 'defaultValue'> & {
  label?: string
  defaultValue?: string
}

export const SsnField = (props: Props) => {
  const [showChangeSsnDialog, setShowChangeSsnDialog] = useState(false)
  const { t } = useTranslation(['common', 'purchase-form'])
  const formatter = useFormatter()

  const openChangeSsnDialog: MouseEventHandler = useCallback(
    (event) => {
      // Prevent submit of the form
      event.preventDefault()
      setShowChangeSsnDialog(true)
    },
    [setShowChangeSsnDialog],
  )

  const closeChangeSsnDialog = useCallback(() => {
    setShowChangeSsnDialog(false)
  }, [setShowChangeSsnDialog])

  const label = t('FIELD_SSN_SE_LABEL', { ns: 'purchase-form' })

  if (props.defaultValue) {
    return (
      <>
        <input type="hidden" readOnly={true} name={props.name} value={props.defaultValue} />

        <div className={fakeInput}>
          <div className={sprinkles({ flexGrow: 1, overflow: 'hidden' })}>
            <Text size="xs" color="textSecondary">
              {t('PERSONAL_NUMBER', { ns: 'common' })}
            </Text>
            <Text size="md">{formatter.ssn(props.defaultValue)}</Text>
          </div>
          <Button onClick={openChangeSsnDialog} size="medium" variant="secondary-alt">
            {'Edit'}
          </Button>
        </div>

        <ChangeSsnWarningDialog
          open={showChangeSsnDialog}
          onAccept={closeChangeSsnDialog}
          onDecline={closeChangeSsnDialog}
        />
      </>
    )
  }

  return <PersonalNumberField label={label} size="medium" {...props} />
}
