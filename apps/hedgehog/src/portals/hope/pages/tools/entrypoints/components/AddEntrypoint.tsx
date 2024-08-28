import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'
import { Flex, Button, Input, Select } from '@hedvig-ui'
import { CreateEntrypointInput } from 'types/generated/graphql'
import { useEntrypoint } from '../hooks'
import { LOCALES } from '../constants'

const Form = styled.form`
  width: max-content;
`

export const AddEntrypoint = () => {
  const { createEntrypoint, isCreatingEntrypoint } = useEntrypoint()

  const { register, handleSubmit, setValue } = useForm<CreateEntrypointInput>()

  const submitHandler = (input: CreateEntrypointInput) => {
    createEntrypoint(input)
    setValue('displayName', '')
  }

  return (
    <Form onSubmit={handleSubmit(submitHandler)}>
      <Flex gap="small" align="end">
        <Input required label="Display name" {...register('displayName')} />
        <Select
          required
          label="Locale"
          {...register('acceptLanguage')}
          options={LOCALES.map(({ value, text }) => ({
            key: value,
            value,
            text,
          }))}
        />

        <Button type="submit" disabled={isCreatingEntrypoint}>
          + Add
        </Button>
      </Flex>
    </Form>
  )
}
