import { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input, Select } from '@hedvig-ui'

const SwedishAccidentFields: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <Fragment>
      <Input
        placeholder="Malmskillnadsgatan 32"
        type="text"
        label="Street"
        errors={errors}
        {...register('street', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="11151"
        type="number"
        label="Zip code"
        errors={errors}
        {...register('zipCode', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="Stockholm"
        type="text"
        label="City"
        errors={errors}
        {...register('city')}
      />
      <Input
        placeholder="63"
        type="number"
        label="Square meters(m²)"
        errors={errors}
        {...register('squareMeters', {
          valueAsNumber: true,
          min: { value: 1, message: 'Min 1' },
          max: { value: 1000, message: 'Max 1000' },
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="YYYYMMDDXXXX"
        type="text"
        label="Personal number"
        errors={errors}
        {...register('personalNumber', {
          minLength: { value: 12, message: '12 numbers' },
          maxLength: { value: 12, message: '12 numbers' },
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
          min: { value: 0, message: 'Min 0' },
          max: { value: 100, message: 'Max 100' },
          required: { value: true, message: 'Required' },
        })}
      />
      <Select
        label="Student"
        options={[
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ]}
        {...register('isStudent', {
          required: { value: true, message: 'Required' },
        })}
      />
    </Fragment>
  )
}

export default SwedishAccidentFields
