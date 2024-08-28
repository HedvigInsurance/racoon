import { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { convertEnumToTitle, Input, Select } from '@hedvig-ui'
import { CarSubTypes } from '../../../config/constants'

const SwedishCarFields: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <Fragment>
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
        placeholder="ABC123"
        type="text"
        label="Registration number"
        {...register('registrationNumber', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="20000"
        type="number"
        label="Average mileage per year (km)"
        {...register('mileage', {
          valueAsNumber: true,
          min: { value: 1, message: 'Min 1 km' },
          required: { value: true, message: 'Required' },
        })}
      />
      <Select
        label="Car insurance type"
        options={Object.entries(CarSubTypes).map(([key, value]) => ({
          value,
          text: convertEnumToTitle(key),
        }))}
        {...register('productSubType', {
          required: { value: true, message: 'Required' },
        })}
      />
    </Fragment>
  )
}

export default SwedishCarFields
