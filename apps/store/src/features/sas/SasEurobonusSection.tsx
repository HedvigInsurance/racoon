import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler, useCallback } from 'react'
import { Button, InputField, Space } from 'ui'
import { useSasEurobonusNumberUpdateMutation } from '@/services/apollo/generated'

type EurobonusSectionState = 'idle' | 'loading' | 'error' | 'complete'

type SasEurobonusSectionProps = {
  eurobonusNumber: string
  state: EurobonusSectionState
  onEurobonusNumberSave: (value: string) => void
}

// TODO:
// - wrapper with GraphlQL implementation
// - design
// - i18n
export const SasEurobonusSection = ({
  eurobonusNumber = '',
  state,
  onEurobonusNumberSave,
}: SasEurobonusSectionProps) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const newValue = formData.get('eurobonusNumber')?.toString().trim() ?? ''
      onEurobonusNumberSave(newValue)
    },
    [onEurobonusNumberSave],
  )

  if (state === 'complete') {
    return <SuccessState />
  }

  return (
    <div>
      Enter your SAS Eurobonus number below and get bonus points*
      <form onSubmit={handleSubmit}>
        <Space y={1}>
          <InputField
            name="eurobonusNumber"
            type="text"
            defaultValue={eurobonusNumber}
            required={true}
            errorMessage={state === 'error' ? 'Something went wrong' : undefined}
          />
          <Button type="submit" loading={state === 'loading'}>
            Save
          </Button>
        </Space>
      </form>
    </div>
  )
}

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

const SuccessState = () => <div>Success!</div>
