import type { ClientSelectAction } from 'embark-core'
import { useTranslateTextLabel } from '../hooks/use-translate-text-label'

export const SelectAction = ({ options }: ClientSelectAction) => {
  const t = useTranslateTextLabel()

  return (
    <select name="value">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.label)}
        </option>
      ))}
    </select>
  )
}
