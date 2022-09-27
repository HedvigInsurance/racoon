import { FormEventHandler } from 'react'
import { Button } from 'ui'
import * as Dialog from '@/components/Dialog/Dialog'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  ExtraBuildingsField as InputFieldExtraBuildings,
  ExtraBuilding,
} from '@/services/PriceForm/Field.types'
import { JSONData } from '@/services/PriceForm/PriceForm.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type ExtraBuildingsFieldProps = {
  field: InputFieldExtraBuildings
  onSubmit: (data: JSONData) => void
  loading: boolean
}

export const ExtraBuildingsField = ({ field, onSubmit, loading }: ExtraBuildingsFieldProps) => {
  const translateLabel = useTranslateTextLabel({ data: {} })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    onSubmit({
      [field.name]: [...(field.value || []), convertExtraBuilding(data)],
    })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button type="button">{translateLabel(field.label)}</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <h3>{translateLabel(field.label)}</h3>

        <form onSubmit={handleSubmit}>
          <SpaceFlex space={1}>
            <Dialog.Close asChild>
              <Button type="button" variant="text">
                Close
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={loading}>
              Add
            </Button>
          </SpaceFlex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const convertExtraBuilding = (data: Record<string, FormDataEntryValue>): ExtraBuilding => {
  if (typeof data.type !== 'string') {
    throw new Error(`ExtraBuilding.type must be a string: ${data.type}`)
  }

  const area = parseInt(data.area.toString(), 10)
  if (typeof area !== 'number') {
    throw new Error(`ExtraBuilding.area must be a number: ${data.area}`)
  }

  return {
    type: data.type,
    area,
    hasWaterConnected: data.hasConnectedWater === 'YES',
  }
}
