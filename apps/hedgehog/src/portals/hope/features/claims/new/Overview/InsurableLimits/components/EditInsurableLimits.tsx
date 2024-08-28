import { Button, Div, Flex, Grid, Input } from '@hedvig-ui/redesign'
import { FormEventHandler } from 'react'
import {
  ClaimInsurableLimitsFragment,
  InsurableLimitsOverwriteInput,
  useOverwriterInsurableLimitsMutation,
} from 'types/generated/graphql'
import { splitInsurableLimitsCategories } from '@hope/features/claims/new/Overview/InsurableLimits/util'
import { toast } from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'

export const EditInsurableLimits = ({
  insurableLimits,
}: {
  insurableLimits: ClaimInsurableLimitsFragment
}) => {
  const [overwriteInsurableLimits, { loading }] =
    useOverwriterInsurableLimitsMutation()

  const submitForm: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const input = toMutationInput(insurableLimits, formData)
    await toast.promise(
      overwriteInsurableLimits({
        variables: { input },
      }),
      {
        loading: 'Saving...',
        success: 'Insurable limits updated!',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const [fixedDeductibleCategory, otherCategories] =
    splitInsurableLimitsCategories(insurableLimits)

  return (
    <form onSubmit={submitForm}>
      <Div p={'large'} style={{ width: 800, maxWidth: '80vw' }}>
        <h2>Edit Insurable Limits</h2>
        <Flex direction={'row'} align={'center'} gap={'medium'} pb={'medium'}>
          <div style={{ fontSize: 32 }}>⚠️</div>
          <p>
            Be aware that saving will overwrite the limits with{' '}
            <b>exactly these values</b>. Therefore, be careful and make sure
            that you have adjusted the individual limits and the total
            accordingly.
          </p>
        </Flex>

        <Grid equalColumns={2} columnGap={'small'} rowGap={'small'}>
          {otherCategories.map((c) => (
            <LimitField
              key={c.id}
              name={c.id}
              displayName={c.displayName}
              usage={c.usage}
              limit={c.limit}
            />
          ))}
        </Grid>
        <Flex direction={'column'} gap={'small'} pt={'medium'}>
          <LimitField
            name={fixedDeductibleCategory.id}
            displayName={fixedDeductibleCategory.displayName}
            usage={fixedDeductibleCategory.usage}
            limit={fixedDeductibleCategory.limit}
          />
          <LimitField
            name="total"
            displayName="Total"
            usage={insurableLimits.totalUsage}
            limit={insurableLimits.totalLimit}
          />
          <Flex justify={'flex-end'} pt={'small'}>
            <Button type={'submit'} disabled={loading}>
              Save
            </Button>
          </Flex>
        </Flex>
      </Div>
    </form>
  )
}

const LimitField = ({
  name,
  displayName,
  usage,
  limit,
}: {
  name: string
  displayName: string
  usage: {
    amount: number
  }
  limit: {
    amount: number
  }
}) => {
  return (
    <Input
      type="number"
      name={name}
      defaultValue={usage.amount}
      label={displayName}
      min={0}
      max={limit.amount}
      affix={{
        content: `limit\u00A0${limit.amount}`,
      }}
    />
  )
}

const toMutationInput = (
  limits: ClaimInsurableLimitsFragment,
  formData: FormData,
): InsurableLimitsOverwriteInput => {
  const body = {
    id: limits.id,
    totalUsage: 0,
    categories: [] as Array<{ id: string; usage: number }>,
  }
  for (const [key, value] of formData.entries()) {
    if (key === 'total') {
      body.totalUsage = parseInt(value.toString())
    } else {
      body.categories.push({
        id: key,
        usage: parseInt(value.toString()),
      })
    }
  }
  return body
}
