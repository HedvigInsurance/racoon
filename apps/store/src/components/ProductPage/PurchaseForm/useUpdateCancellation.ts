import { usePriceIntentCancellationRequestedUpdateMutation } from '@/services/apollo/generated'

type Params = { priceIntentId: string }

export const useUpdateCancellation = ({ priceIntentId }: Params) => {
  const [updateCancellation, result] = usePriceIntentCancellationRequestedUpdateMutation()

  const handleUpdateCancellation = (requested: boolean) => {
    updateCancellation({
      variables: {
        priceIntentId,
        requested,
      },
    }).catch((err) => {
      console.log('Ignore update error until fixed on backend', err)
    })
  }

  // TODO: Extract boilerplate to some util module.  Localize generic error
  let userError = null
  if (result.error) {
    userError = { message: 'Something went wrong' }
  } else {
    const error = result.data?.priceIntentCancellationRequestedUpdate.userErrors[0]
    if (error) {
      userError = { message: error.message }
    }
  }

  return [
    handleUpdateCancellation,
    {
      loading: result.loading,
      userError,
    },
  ] as const
}
