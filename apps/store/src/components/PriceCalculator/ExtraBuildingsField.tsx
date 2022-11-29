import styled from '@emotion/styled'
import { FormEventHandler, useState } from 'react'
import { Button, Heading, InputField, Space, Dialog, mq } from 'ui'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/Header'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  ExtraBuildingsField as InputFieldExtraBuildings,
  ExtraBuilding,
  FieldOption,
} from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { InputSwitch } from './InputSwitch'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type ExtraBuildingsFieldProps = {
  field: InputFieldExtraBuildings
  onSubmit: (data: JSONData) => Promise<void>
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

  const translateLabel = useTranslateTextLabel({ data: {} })

  const buildingOptionsInput = buildingOptions.map((option) => {
    return { name: option.label.key, value: option.value }
  })

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
      <Space y={0.5}>
        <Label>{translateLabel(field.label)}</Label>

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
                <Button type="button" variant="text" onClick={() => handleRemove(item)}>
                  Delete
                </Button>
              </Preview>
            )
          })}
        </Space>

        <Dialog.Trigger asChild>
          <Button type="button" fullWidth variant="outlined">
            Add extra building
          </Button>
        </Dialog.Trigger>
      </Space>

      <Dialog.Content>
        <DialogContentWrapper>
          <Space y={1.5}>
            <SpaceFlex align="center" direction="vertical">
              <Heading as="h2" variant="standard.18">
                Add extra building
              </Heading>
            </SpaceFlex>

            <form onSubmit={handleSubmit}>
              <Space y={1}>
                <Space y={1}>
                  <SpaceFlex align="center" space={1}>
                    <Flex>
                      <InputSelect
                        name="type"
                        label="Building type"
                        options={buildingOptionsInput}
                        required={true}
                      />
                    </Flex>
                    <Flex>
                      <InputField type="number" name="area" label="Size" min={0} required={true} />
                    </Flex>
                  </SpaceFlex>
                  <InputSwitch name="hasWaterConnected" label="Water connected" />
                </Space>

                <SpaceFlex space={1}>
                  <Dialog.Close asChild>
                    <Button type="button" variant="text" fullWidth>
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button type="submit" disabled={loading} fullWidth>
                    Add
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

const DialogContentWrapper = styled(Dialog.Window)(({ theme }) => ({
  marginTop: MENU_BAR_HEIGHT_MOBILE,
  marginRight: theme.space[3],
  marginLeft: theme.space[3],
  padding: theme.space[4],
  borderRadius: 8,
  [mq.md]: {
    marginTop: MENU_BAR_HEIGHT_DESKTOP,
  },
}))

const Flex = styled.div({ flex: 1 })

const Label = styled.p(({ theme }) => ({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[1],
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
