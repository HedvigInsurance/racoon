import { Button, InputField } from 'ui'

import type { ClientTextAction } from 'embark-core'
import { useTranslateTextLabel } from '../hooks/use-translate-text-label'

type Props = ClientTextAction & {
  name?: string
  singleAction?: boolean
}

export const TextAction = ({ title, placeholder, name = 'value', singleAction = true }: Props) => {
  const t = useTranslateTextLabel()

  return (
    <>
      <InputField label={t(title)} id={name} name={name} type="text" placeholder={t(placeholder)} />
      {singleAction && <Button>Continue</Button>}
    </>
  )
}
