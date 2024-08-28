import { FC, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@hedvig-ui'

const NorwegianAccidentFields: FC = () => {
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
    </Fragment>
  )
}

export default NorwegianAccidentFields
