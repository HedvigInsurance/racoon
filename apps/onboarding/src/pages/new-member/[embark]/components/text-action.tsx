import type { ClientTextAction } from 'embark-core'
import { InputField } from 'ui'
import { useTranslateTextLabel } from '../hooks/use-translate-text-label'

type Props = ClientTextAction & {
  name?: string
}

export const TextAction = ({ title, placeholder, name = 'value' }: Props) => {
  const t = useTranslateTextLabel()

  return (
    <InputField label={t(title)} id={name} name={name} type="text" placeholder={t(placeholder)} />
  )
}
