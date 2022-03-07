import { Button, InputField } from 'ui'

import type { ClientTextAction } from 'embark-core'
import { useTranslateTextLabel } from '../hooks/use-translate-text-label'

type Props = ClientTextAction & {
  name?: string
  singleAction?: boolean
  autoFocus?: boolean
  required?: boolean
}

export const TextAction = ({
  title,
  placeholder,
  name = 'value',
  singleAction = true,
  autoFocus = true,
  required = true,
}: Props) => {
  const t = useTranslateTextLabel()

  return (
    <>
      <InputField
        label={t(title)}
        id={name}
        name={name}
        type="text"
        placeholder={t(placeholder)}
        autoFocus={autoFocus}
        required={required}
      />
      {singleAction && <Button>Continue</Button>}
    </>
  )
}
