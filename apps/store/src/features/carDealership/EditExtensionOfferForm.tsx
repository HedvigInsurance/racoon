import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { theme } from 'ui/src/theme/theme'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { CarMileageField } from '@/components/PriceCalculator/CarMileageField'
import { ActionButton } from '@/components/ProductItem/ProductItem'

const MILEAGE_DATA_KEY = 'mileage'
const OFFER_KEY = 'offer'

type EditExtensionOfferFormProps = {
  data: Record<string, unknown>
  onSave: (option: string, data: Record<string, unknown>) => void
  loading: boolean

  defaultTierLevel: string
  tierLevelOptions: Array<{ name: string; value: string }>

  onCancel: () => void
}

export const EditExtensionOfferForm = (props: EditExtensionOfferFormProps) => {
  const { t } = useTranslation('carDealership')

  const handleChangeTierLevel = () => {
    datadogRum.addAction('Offer Car Tier Level Change')
  }

  const handleClickCancel = () => {
    datadogRum.addAction('Offer Car Cancel')
    props.onCancel()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = {
      [MILEAGE_DATA_KEY]: formData.get(MILEAGE_DATA_KEY),
    }

    const option = formData.get(OFFER_KEY)
    if (typeof option !== 'string') {
      throw new Error('Missing offer')
    }

    props.onSave(option, data)

    datadogRum.addAction('Offer Car Save', {
      changedMileage: data[MILEAGE_DATA_KEY] !== props.data[MILEAGE_DATA_KEY]?.toString(),
      changedTierLevel: option !== props.defaultTierLevel,
    })
  }

  const mileageField = {
    type: 'car-mileage',
    name: MILEAGE_DATA_KEY,
    label: { key: 'FIELD_MILEAGE_LABEL' },
    required: true,
    defaultValue: props.data[MILEAGE_DATA_KEY]?.toString(),
  } as const

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <InputWrapper>
        <InputSelect
          name={OFFER_KEY}
          onChange={handleChangeTierLevel}
          options={props.tierLevelOptions}
          backgroundColor="backgroundFrostedGlass"
          defaultValue={props.defaultTierLevel}
        />
        <CarMileageField field={mileageField} backgroundColor="backgroundFrostedGlass" />
      </InputWrapper>

      <ButtonWrapper>
        <ActionButton type="submit" variant="secondary-alt" loading={props.loading}>
          {t('EDIT_OFFER_SAVE')}
        </ActionButton>
        <ActionButton type="button" variant="ghost" onClick={handleClickCancel}>
          {t('EDIT_OFFER_CANCEL')}
        </ActionButton>
      </ButtonWrapper>
    </FormWrapper>
  )
}

const FormWrapper = styled.form({
  display: 'grid',
  gridAutoFlow: 'row',
  gap: theme.space.sm,
})

const InputWrapper = styled.div({
  display: 'grid',
  gridAutoFlow: 'row',
  gap: theme.space.xxs,
})

const ButtonWrapper = styled.div({
  display: 'grid',
  gridAutoFlow: 'column',
  gap: theme.space.xs,
})
