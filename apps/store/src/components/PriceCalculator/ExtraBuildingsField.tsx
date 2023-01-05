import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, useState } from 'react'
import { Button, Heading, Space, Dialog, Text } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextField } from '@/components/TextField/TextField'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'
import {
  ExtraBuildingsField as InputFieldExtraBuildings,
  ExtraBuilding,
  FieldOption,
} from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type ExtraBuildingsFieldProps = {
  field: InputFieldExtraBuildings
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
  buildingOptions: Array<FieldOption>
}

export const ExtraBuildingsField = ({
  field,
  onSubmit,
  loading,
  buildingOptions,
}: ExtraBuildingsFieldProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { t } = useTranslation('purchase-form')
  const translateLabel = useTranslateFieldLabel()

  const buildingOptionsInput = buildingOptions.map((option) => ({
    name: translateLabel(option.label),
    value: option.value,
  }))

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    await onSubmit({
      [field.name]: [...(field.value || []), convertExtraBuilding(data)],
    })
    setIsOpen(false)
  }

  const handleRemove = async (extraBuilding: ExtraBuilding) => {
    const identifier = JSON.stringify(extraBuilding)

    await onSubmit({
      [field.name]: (field.value || []).filter((item) => {
        const itemIdentifier = JSON.stringify(item)
        return itemIdentifier !== identifier
      }),
    })
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <Card y={1}>
        <Text size="lg">{translateLabel(field.label)}</Text>

        <Space y={0.5} as="ul">
          {field.value?.map((item) => {
            const identifier = JSON.stringify(item)
            const buildingOption = buildingOptions.find((option) => option.value === item.type)
            const buildingOptionName = buildingOption?.label ?? { key: item.type }
            return (
              <Preview key={identifier}>
                <SpaceFlex space={0.25} align="end">
                  <Text>{translateLabel(buildingOptionName)}</Text>
                  <Text as="span" color="textSecondary">
                    {item.area} m<Sup>2</Sup>
                  </Text>
                </SpaceFlex>
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={() => handleRemove(item)}
                  >
                    {t('FIELD_EXTRA_BUILDINGS_DELETE_BUTTON')}
                  </Button>
                </div>
              </Preview>
            )
          })}
        </Space>

        <Dialog.Trigger asChild>
          <Button type="button" variant="secondary">
            {t('FIELD_EXTRA_BUILDINGS_ADD_BUTTON')}
          </Button>
        </Dialog.Trigger>
      </Card>

      <DialogContent>
        <DialogContentWrapper>
          <Space y={1.5}>
            <SpaceFlex align="center" direction="vertical">
              <Heading as="h2" variant="standard.18">
                {t('FIELD_EXTRA_BUILDINGS_ADD_BUTTON')}
              </Heading>
            </SpaceFlex>

            <form onSubmit={handleSubmit}>
              <Space y={1}>
                <Space y={1}>
                  <Space y={0.25}>
                    <InputSelect
                      name="type"
                      label={t('FIELD_EXTRA_BUILDINGS_TYPE_LABEL')}
                      options={buildingOptionsInput}
                      required={true}
                    />
                    <TextField
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      name="area"
                      label={t('FIELD_EXTRA_BUILDINGS_AREA_LABEL')}
                      min={0}
                      suffix="m²"
                      required
                    />
                    <ToggleCard
                      name="hasWaterConnected"
                      label={t('FIELD_HAS_WATER_CONNECTED_LABEL')}
                    />
                  </Space>
                </Space>

                <Space y={0.25}>
                  <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                    {t('FIELD_EXTRA_BUILDINGS_MODAL_ADD')}
                  </Button>
                  <Dialog.Close asChild>
                    <Button type="button" variant="ghost">
                      {t('DIALOG_BUTTON_CANCEL')}
                    </Button>
                  </Dialog.Close>
                </Space>
              </Space>
            </form>
          </Space>
        </DialogContentWrapper>
      </DialogContent>
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

const Card = styled(Space)(({ theme }) => ({
  padding: `${theme.space[3]} ${theme.space[4]}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray300,
}))

const DialogContent = styled(Dialog.Content)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space[2],
}))

const DialogContentWrapper = styled(Dialog.Window)(({ theme }) => ({
  marginRight: theme.space[3],
  marginLeft: theme.space[3],
  padding: theme.space[4],
  borderRadius: 8,
  width: '100%',
  maxWidth: '32rem',
}))

const Preview = styled.li({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Sup = styled.sup({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
