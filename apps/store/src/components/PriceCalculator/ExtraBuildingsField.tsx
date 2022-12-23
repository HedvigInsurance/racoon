import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, useState } from 'react'
import { Button, Heading, Space, Dialog } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { TextField } from '@/components/TextField/TextField'
import {
  ExtraBuildingsField as InputFieldExtraBuildings,
  ExtraBuilding,
  FieldOption,
} from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { InputSwitch } from './InputSwitch'
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
      <Card y={0.5}>
        <Text size="l">{translateLabel(field.label)}</Text>

        <Space y={0.5} as="ul">
          {field.value?.map((item) => {
            const identifier = JSON.stringify(item)
            const buildingOption = buildingOptions.find((option) => option.value === item.type)
            const buildingOptionName = buildingOption?.label ?? { key: item.type }
            return (
              <Preview key={identifier}>
                <SpaceFlex space={0.25} align="end">
                  <p>{translateLabel(buildingOptionName)}</p>
                  <MutedText>
                    {item.area} m<Sup>2</Sup>
                  </MutedText>
                </SpaceFlex>
                <Button type="button" variant="ghost" onClick={() => handleRemove(item)}>
                  {t('FIELD_EXTRA_BUILDINGS_DELETE_BUTTON')}
                </Button>
              </Preview>
            )
          })}
        </Space>

        <Dialog.Trigger asChild>
          <Button type="button" variant="ghost">
            {t('FIELD_EXTRA_BUILDINGS_ADD_BUTTON')}
          </Button>
        </Dialog.Trigger>
      </Card>

      <Dialog.Content>
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
                      required
                    />
                  </Space>
                  <InputSwitch
                    name="hasWaterConnected"
                    label={t('FIELD_HAS_WATER_CONNECTED_LABEL')}
                  />
                </Space>

                <SpaceFlex space={1}>
                  <Dialog.Close asChild>
                    <Button type="button" variant="ghost">
                      {t('FIELD_EXTRA_BUILDINGS_MODAL_CANCEL')}
                    </Button>
                  </Dialog.Close>
                  <Button type="submit" disabled={loading}>
                    {t('FIELD_EXTRA_BUILDINGS_MODAL_ADD')}
                  </Button>
                </SpaceFlex>
              </Space>
            </form>
          </Space>
        </DialogContentWrapper>
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

const Card = styled(Space)(({ theme }) => ({
  padding: `${theme.space[3]} ${theme.space[4]}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray300,
}))

const DialogContentWrapper = styled(Dialog.Window)(({ theme }) => ({
  marginRight: theme.space[3],
  marginLeft: theme.space[3],
  marginTop: '3.5rem',
  padding: theme.space[4],
  borderRadius: 8,
}))

const Preview = styled.li(({ theme }) => ({
  border: `1px solid ${theme.colors.gray500}`,
  borderRadius: 8,
  paddingLeft: theme.space[5],

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

const MutedText = styled.p(({ theme }) => ({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[1],
  color: theme.colors.gray700,
}))

const Sup = styled.sup({
  verticalAlign: 'super',
  fontSize: '70%',
  lineHeight: 1,
})
