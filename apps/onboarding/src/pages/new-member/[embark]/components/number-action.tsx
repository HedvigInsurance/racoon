import type { ClientNumberAction } from 'embark-core'
import { useTranslateTextLabel } from '../hooks/use-translate-text-label'

export const NumberAction = ({ placeholder, minValue }: ClientNumberAction) => {
  const t = useTranslateTextLabel()

  return <input name="value" type="number" placeholder={t(placeholder)} min={minValue} />
}
