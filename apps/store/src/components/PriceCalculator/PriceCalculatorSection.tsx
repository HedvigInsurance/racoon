import { FormEventHandler, ReactNode } from 'react'
import { Button, Space } from 'ui'
import { deserializeField } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { FormSection, JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = {
  section: FormSection
  loading: boolean
  onSubmit: (data: JSONData) => void
  children: ReactNode
}

export const PriceCalculatorSection = ({ section, loading, onSubmit, children }: Props) => {
  const translateLabel = useTranslateTextLabel({ data: {} })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const data: JSONData = {}

    for (const item of section.items) {
      const formValue = formData.get(item.field.name)

      if (typeof formValue === 'string') {
        data[item.field.name] = deserializeField(item.field, formValue)
      } else if (item.field.value === undefined && item.field.defaultValue) {
        data[item.field.name] = item.field.defaultValue
      }
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space y={0.25}>
        {children}

        <footer>
          <Button type="submit" fullWidth disabled={loading}>
            {translateLabel(section.submitLabel)}
          </Button>
        </footer>
      </Space>
    </form>
  )
}
