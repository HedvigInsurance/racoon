import type { ClientTextAction } from 'embark-core'
import { useTranslateTextLabel } from '../hooks/use-translate-text-label'

type Props = ClientTextAction & {
  name?: string
}

export const TextAction = ({ title, placeholder, name = 'value' }: Props) => {
  const t = useTranslateTextLabel()

  return (
    <div>
      <label htmlFor={name}>{t(title)}</label>
      <input id={name} name={name} type="text" placeholder={t(placeholder)} />
    </div>
  )
}
