import { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input, Select } from '@hedvig-ui'

const NorwegianTravelFields: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <Fragment>
      <Input
        placeholder="YYYY-MM-DD"
        type="text"
        label="Birth date"
        errors={errors}
        {...register('birthDate', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="1"
        type="number"
        label="Co-Insured"
        errors={errors}
        {...register('coInsured', {
          valueAsNumber: true,
          required: { value: true, message: 'Required' },
        })}
      />
      <Select
        label="Youth"
        options={[
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ]}
        {...register('isYouth', {
          required: { value: true, message: 'Required' },
        })}
      />
    </Fragment>
  )
}

export default NorwegianTravelFields
