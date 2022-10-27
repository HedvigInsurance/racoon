import { datadogLogs } from '@datadog/browser-logs'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { formatAPIDate } from './CheckoutPage.helpers'
import { CheckoutPageProps, UserErrors } from './CheckoutPage.types'

export type Params = {
  cartId: string
  products: CheckoutPageProps['products']
  onSuccess: (formData: FormData) => void
}

export const useUpdateStartDates = ({ cartId, products, onSuccess }: Params) => {
  const [updateStartDate, result] = useStartDateUpdateMutation({
    onError(error) {
      datadogLogs.logger.warn('Failed to update start date', { error })
    },
  })

  const handleSubmit = async (formData: FormData) => {
    datadogLogs.logger.info('Checkout | Submit start dates')

    const updates = products.map((product) => {
      const dateValue = formData.get(product.offerId)
      const date = convertToDate(dateValue)

      if (!date) {
        datadogLogs.logger.warn('Unable to update start dates', {
          offerId: product.offerId,
          dateValue,
        })
        throw new Error(`Invalid date value for ${product.offerId}`)
      }

      return { offerId: product.offerId, startDate: formatAPIDate(date) }
    })

    updateStartDate({
      variables: { input: { cartId, updates } },
      onCompleted(data) {
        if (data.cartEntriesStartDateUpdate.userErrors.length === 0) {
          onSuccess(formData)
        }
      },
    })
  }

  const userErrors: UserErrors = {
    ...(result.error && { form: 'Something went wrong' }),
    ...result.data?.cartEntriesStartDateUpdate.userErrors.reduce(
      (errors, error) => ({
        ...errors,
        [error.offerId]: error.message,
      }),
      {},
    ),
  }

  return [
    handleSubmit,
    {
      loading: result.loading,
      userErrors,
    },
  ] as const
}

const convertToDate = (value: unknown) => {
  if (typeof value === 'string') {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date
  }

  return null
}
