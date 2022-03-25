import type { ClientNumberAction } from 'embark-core'
import { Button, InputField } from 'ui'
import { useTranslateTextLabel } from './useTranslateTextLabel'

export const NumberAction = ({ placeholder, minValue }: ClientNumberAction) => {
  const t = useTranslateTextLabel()

  return (
    <>
      <InputField
        name="value"
        type="number"
        placeholder={t(placeholder)}
        min={minValue}
        required
        autoFocus
      />
      <Button>Continue</Button>
    </>
  )
}
