import { Button, Flex, Input, Label, Spacing } from '@hedvig-ui'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  GetClaimPropertyOptionsDocument,
  useCreateClaimPropertyOptionMutation,
  useGetClaimPropertyOptionsQuery,
} from 'types/generated/graphql'

export const CreateOptionForm: React.FC = () => {
  const { data } = useGetClaimPropertyOptionsQuery()
  const [newOptionName, setNewOptionName] = useState('')
  const [createOption, { loading }] = useCreateClaimPropertyOptionMutation()

  const options = data?.claimPropertyOptions

  if (!options) {
    return null
  }

  const handleSubmit = () => {
    toast.promise(
      createOption({
        variables: { name: newOptionName },
        refetchQueries: [{ query: GetClaimPropertyOptionsDocument }],
      }),
      {
        loading: 'Creating option',
        success: () => {
          setNewOptionName('')
          return 'Option created'
        },
        error: 'Could not create option',
      },
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <Flex direction="column" fullWidth>
        <Label>Option name</Label>
        <Input
          value={newOptionName}
          onChange={(e) => {
            setNewOptionName(e.currentTarget.value)
          }}
        />
        <Spacing top={'small'} />
        <Button
          disabled={
            !!options.find(
              (option) =>
                option.name.toLowerCase() === newOptionName.toLowerCase(),
            ) ||
            !newOptionName ||
            loading
          }
          type="submit"
        >
          Create
        </Button>
      </Flex>
    </form>
  )
}
