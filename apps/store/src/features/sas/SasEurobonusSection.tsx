import { FormEventHandler, useCallback } from 'react'
import { Button, InputField, Space } from 'ui'

type EurobonusSectionState = 'idle' | 'loading' | 'error' | 'complete'

type SasEurobonusSectionProps = {
  state: EurobonusSectionState
  eurobonusNumber?: string
  onEurobonusNumberSave: (value: string) => void
}

// TODO:
// - wrapper with GraphlQL implementation
// - design
// - i18n
export const SasEurobonusSection = ({
  state,
  eurobonusNumber,
  onEurobonusNumberSave,
}: SasEurobonusSectionProps) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const newValue = formData.get('eurobonusNumber') as string
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
            defaultValue={eurobonusNumber ?? ''}
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

const SuccessState = () => <div>Success!</div>
