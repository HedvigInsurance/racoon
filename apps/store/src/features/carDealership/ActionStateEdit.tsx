import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { theme } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { CarMileageField } from '@/components/PriceCalculator/CarMileageField'
import { ActionButton } from '../../components/ProductItem/ProductItem'

const MILEAGE_DATA_KEY = 'mileage'
const OFFER_KEY = 'offer'

type EditingStateProps = {
  data: Record<string, unknown>
  onSave: (option: string, data: Record<string, unknown>) => void
  loading: boolean

  options: Array<{ name: string; value: string }>

  onCancel: () => void
}

export const ActionStateEdit = (props: EditingStateProps) => {
  const handleChangeTierLevel = () => {
    datadogRum.addAction('Offer Car Tier Level Change')
  }

  const handleClickCancel = () => {
    datadogRum.addAction('Offer Car Cancel')
    props.onCancel()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    datadogRum.addAction('Offer Car Save')

    const formData = new FormData(event.currentTarget)
    const data = {
      [MILEAGE_DATA_KEY]: formData.get(MILEAGE_DATA_KEY),
    }

    const option = formData.get(OFFER_KEY)
    if (typeof option !== 'string') {
      throw new Error('Missing offer')
    }

    props.onSave(option, data)
  }

  const mileageField = {
    type: 'car-mileage',
    name: MILEAGE_DATA_KEY,
    label: { key: 'FIELD_MILEAGE_LABEL' },
    required: true,
    defaultValue: '1000',
  } as const

  const mileage = props.data[MILEAGE_DATA_KEY]
  const defaultValue = typeof mileage === 'string' ? mileage : undefined

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <InputWrapper>
        <InputSelect
          name={OFFER_KEY}
          onChange={handleChangeTierLevel}
          defaultValue={defaultValue}
          options={props.options}
          backgroundColor="backgroundStandard"
        />
        <CarMileageField field={mileageField} backgroundColor="backgroundStandard" />
      </InputWrapper>

      <ButtonWrapper>
        <ActionButton type="submit" variant="primary-alt" loading={props.loading}>
          Save
        </ActionButton>
        <ActionButton type="button" onClick={handleClickCancel}>
          Cancel
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
