import { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input, Select } from '@hedvig-ui'
import ExtraBuildings from '../components/ExtraBuildings'

const NorwegianHouseFields: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <Fragment>
      <Input
        placeholder="Apotekergata 10"
        type="text"
        label="Street"
        errors={errors}
        {...register('street', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="0180"
        type="number"
        label="Zip code"
        errors={errors}
        {...register('zipCode', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="Oslo"
        type="text"
        label="City"
        errors={errors}
        {...register('city', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="63"
        type="number"
        label="Square meters (m²)"
        errors={errors}
        {...register('squareMeters', {
          valueAsNumber: true,
          min: { value: 1, message: 'Min 1' },
          max: { value: 1000, message: 'Max 1000' },
          required: { value: true, message: 'Required' },
        })}
      />
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
          min: { value: 0, message: 'Min 0' },
          max: { value: 100, message: 'Max 100' },
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="1910"
        type="number"
        label="Year of construction"
        errors={errors}
        {...register('yearOfConstruction', {
          valueAsNumber: true,
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="1920"
        type="number"
        label="Year of ownership"
        errors={errors}
        {...register('yearOfOwnership', {
          valueAsNumber: true,
          required: { value: true, message: 'Required' },
        })}
      />
      <Select
        label="Has water leakage detector?"
        options={[
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ]}
        {...register('waterLeakageDetector', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Select
        label="Is subleted?"
        options={[
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ]}
        {...register('isSubleted', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="2"
        type="number"
        label="Number of wet units"
        errors={errors}
        {...register('numberOfWetUnits', {
          valueAsNumber: true,
          required: { value: true, message: 'Required' },
        })}
      />
      <ExtraBuildings />
    </Fragment>
  )
}

export default NorwegianHouseFields
