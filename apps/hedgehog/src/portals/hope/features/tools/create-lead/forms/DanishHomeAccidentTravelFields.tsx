import { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { convertEnumToTitle, Input, Select } from '@hedvig-ui'
import { Market, SubTypeMarketTypes } from '../../../config/constants'

const DanishHomeAccidentTravelFields: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <Fragment>
      <Input
        placeholder="Fuglevangsvej 11"
        type="text"
        label="Street"
        errors={errors}
        {...register('street', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="1962"
        type="number"
        label="Zip code"
        errors={errors}
        {...register('zipCode', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="Copenhagen"
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
      <Select
        label="Sub type"
        options={SubTypeMarketTypes[Market.Denmark].map((subType) => ({
          value: subType,
          text: convertEnumToTitle(subType),
        }))}
        {...register('productSubType', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="25"
        type="number"
        label="Age"
        errors={errors}
        {...register('age', {
          valueAsNumber: true,
          min: { value: 1, message: 'Min age of 1' },
          required: { value: true, message: 'Required' },
        })}
      />
    </Fragment>
  )
}

export default DanishHomeAccidentTravelFields
