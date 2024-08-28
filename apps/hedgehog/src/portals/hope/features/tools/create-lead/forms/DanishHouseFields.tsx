import { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input, Select } from '@hedvig-ui'
import ExtraBuildings from '../components/ExtraBuildings'

const DanishHouseFields: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  return (
    <Fragment>
      <Input
        placeholder="Høyrups Alle 22"
        type="text"
        label="Street"
        errors={errors}
        {...register('street', {
          required: { value: true, message: 'Required' },
        })}
      />
      <Input
        placeholder="2900"
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

export default DanishHouseFields
