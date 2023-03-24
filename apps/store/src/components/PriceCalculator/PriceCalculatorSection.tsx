import { FormEventHandler, ReactNode } from 'react'
import { Button, Space } from 'ui'
import { deserializeField } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { FormSection, JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  section: FormSection
  loading: boolean
  onSubmit: (data: JSONData) => void
  children: ReactNode
}

export const PriceCalculatorSection = ({ section, loading, onSubmit, children }: Props) => {
  const translateLabel = useTranslateFieldLabel()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const data: JSONData = {}

    for (const item of section.items) {
      const deserializedFieldValue = deserializeField(item.field, formData)
      if (deserializedFieldValue !== undefined) {
        data[item.field.name] = deserializedFieldValue
      }
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space y={0.25}>
        {children}

        <Space as="footer" y={0.25}>
          <Button type="submit" disabled={loading} loading={loading}>
            {translateLabel(section.submitLabel)}
          </Button>
        </Space>
      </Space>
    </form>
  )
}
