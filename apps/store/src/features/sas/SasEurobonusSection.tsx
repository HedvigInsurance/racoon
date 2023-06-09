import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, useCallback } from 'react'
import { Button, CheckIcon, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextField } from '@/components/TextField/TextField'
import { useSasEurobonusNumberUpdateMutation } from '@/services/apollo/generated'

type EurobonusSectionState = 'idle' | 'loading' | 'error' | 'complete'

type SasEurobonusSectionProps = {
  eurobonusNumber: string
  state: EurobonusSectionState
  onEurobonusNumberSave: (value: string) => void
}

export const SasEurobonusSection = ({
  eurobonusNumber = '',
  state,
  onEurobonusNumberSave,
}: SasEurobonusSectionProps) => {
  const { t } = useTranslation('checkout')

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const newValue = formData.get('eurobonusNumber')?.toString().trim() ?? ''
      onEurobonusNumberSave(newValue)
    },
    [onEurobonusNumberSave],
  )

  return (
    <form onSubmit={handleSubmit}>
      <Text color="textPrimary" size="xl">
        {t('SAS_SECTION_TITLE')}
      </Text>
      <Text color="textSecondary" size="xl">
        {t('SAS_SECTION_TEXT')}
      </Text>
      <FieldWrapper>
        <TextField
          label={t('SAS_BONUS_NUMBER_INPUT_LABEL')}
          name="eurobonusNumber"
          defaultValue={eurobonusNumber}
          required={true}
          disabled={state === 'complete'}
          warning={state === 'error'}
          message={state === 'error' ? t('UNKNOWN_ERROR_MESSAGE', { ns: 'common' }) : undefined}
        />
      </FieldWrapper>
      {state === 'complete' ? (
        <SpaceFlex direction="horizontal" align="center">
          <CheckIcon color={theme.colors.greenElement} />
          <Text>{t('SAS_BONUS_NUMBER_SAVED')}</Text>
        </SpaceFlex>
      ) : (
        <Button type="submit" loading={state === 'loading'}>
          {t('SAS_BONUS_NUMBER_SAVE_BUTTON')}
        </Button>
      )}
    </form>
  )
}

const FieldWrapper = styled.div({
  marginTop: theme.space.lg,
  marginBottom: theme.space.xxs,
})

type SasEurobonusSectionContainerProps = {
  initialValue: string
}
export const SasEurobonusSectionContainer = ({
  initialValue,
}: SasEurobonusSectionContainerProps) => {
  const [saveValue, mutationResult] = useSasEurobonusNumberUpdateMutation()

  const handleEurobonusNumberSave = async (value: string) => {
    try {
      await saveValue({ variables: { value } })
    } catch (err) {
      datadogLogs.logger.info('Failed to save eurobonus number', err ?? undefined)
    }
  }

  let state: EurobonusSectionState = 'idle'
  if (mutationResult.loading) {
    state = 'loading'
  } else if (mutationResult.error) {
    state = 'error'
  } else if (mutationResult.data) {
    state = 'complete'
  }

  return (
    <SasEurobonusSection
      eurobonusNumber={initialValue}
      state={state}
      onEurobonusNumberSave={handleEurobonusNumberSave}
    />
  )
}
