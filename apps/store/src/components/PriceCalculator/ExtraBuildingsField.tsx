import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, useState } from 'react'
import { Button, Heading, Space, Dialog, Text, theme, PlusIcon, CrossIcon } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextField } from '@/components/TextField/TextField'
import {
  ExtraBuildingsField as InputFieldExtraBuildings,
  ExtraBuilding,
  FieldOption,
} from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import * as InputRadio from './InputRadio'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

enum RadioOption {
  YES = 'YES',
  NO = 'NO',
}

enum Field {
  Type = 'type',
  Area = 'area',
  HasWaterConnected = 'hasWaterConnected',
}

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
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Card y={0.5}>
        <Text size="xs" color="textSecondary">
          {translateLabel(field.label)}
        </Text>

        <Space y={0.5} as="ul">
          {field.value?.map((item) => {
            const identifier = JSON.stringify(item)
            const buildingOption = buildingOptions.find((option) => option.value === item.type)
            const buildingOptionName = buildingOption?.label ?? { key: item.type }
            return (
              <Preview key={identifier}>
                <Text size="xl">
                  {/* TODO: Properly localize without string concatenation */}
                  {translateLabel(buildingOptionName)}, {item.area} m<Sup>2</Sup>
                </Text>
                <InvisibleButton
                  type="button"
                  onClick={() => handleRemove(item)}
                  aria-label={t('FIELD_EXTRA_BUILDINGS_DELETE_BUTTON')}
                >
                  <CrossIcon size="1rem" />
                </InvisibleButton>
              </Preview>
            )
          })}
        </Space>

        <Dialog.Trigger asChild>
          <Button type="button" variant="primary-alt" size="medium">
            <SpaceFlex space={0.5} align="center">
              <PlusIcon size="1rem" />
              <div>{t('FIELD_EXTRA_BUILDINGS_ADD_BUTTON')}</div>
            </SpaceFlex>
          </Button>
        </Dialog.Trigger>
      </Card>

      <DialogContent onClose={() => setIsOpen(false)}>
        <DialogContentWrapper>
          <Space y={1.5}>
            <Header>
              <Heading as="h3" variant="standard.24">
                {t('FIELD_EXTRA_BUILDINGS_ADD_BUTTON')}
              </Heading>

              <DialogClose type="button">
                <CrossIcon />
              </DialogClose>
            </Header>

            <form onSubmit={handleSubmit}>
              <Space y={1.5}>
                <Space y={0.25}>
                  <InputSelect
                    name={Field.Type}
                    placeholder={t('FIELD_EXTRA_BUILDINGS_TYPE_LABEL')}
                    options={buildingOptionsInput}
                    required={true}
                  />
                  <TextField
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    name={Field.Area}
                    label={t('FIELD_EXTRA_BUILDINGS_AREA_LABEL')}
                    min={0}
                    suffix="m²"
                    required
                  />
                  <InputRadio.Root
                    name={Field.HasWaterConnected}
                    label={t('FIELD_HAS_WATER_CONNECTED_LABEL')}
                  >
                    <InputRadio.Item label={t('LABEL_NO')} value={RadioOption.NO} />
                    <InputRadio.Item label={t('LABEL_YES')} value={RadioOption.YES} />
                  </InputRadio.Root>
                </Space>

                <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                  <SpaceFlex space={0.5} align="center">
                    <PlusIcon size="1rem" />
                    <div>{t('FIELD_EXTRA_BUILDINGS_MODAL_ADD')}</div>
                  </SpaceFlex>
                </Button>
              </Space>
            </form>
          </Space>
        </DialogContentWrapper>
      </DialogContent>
    </Dialog.Root>
  )
}

const convertExtraBuilding = (data: Record<string, FormDataEntryValue>): ExtraBuilding => {
  const type = data[Field.Type]
  if (typeof type !== 'string') {
    throw new Error(`ExtraBuilding.type must be a string: ${data.type}`)
  }

  const area = parseInt(data[Field.Area].toString(), 10)
  if (typeof area !== 'number') {
    throw new Error(`ExtraBuilding.area must be a number: ${data.area}`)
  }

  return {
    type,
    area,
    hasWaterConnected: data[Field.HasWaterConnected] === RadioOption.YES,
  }
}

const Card = styled(Space)({
  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.opaque1,
})

const DialogContent = styled(Dialog.Content)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space.xs,
})

const DialogContentWrapper = styled(Dialog.Window)({
  marginInline: theme.space.xs,
  paddingInline: theme.space.sm,
  paddingBlock: theme.space.lg,
  borderRadius: theme.radius.md,
  width: '100%',
  maxWidth: '32rem',
})

const Header = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  justifyItems: 'center',

  paddingInline: theme.space.xxs,
})

const ButtonStyles = { cursor: 'pointer' }
const DialogClose = styled(Dialog.Close)(ButtonStyles)
const InvisibleButton = styled.button(ButtonStyles)

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
