import { InputStartDay } from '@/components/InputDay/InputStartDay'
import {
  type ProductOfferFragment,
  useCancellationRequestedUpdateMutation,
  usePriceIntentQuery,
  useStartDateUpdateMutation,
  ExternalInsuranceCancellationOption,
} from '@/services/graphql/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { IEXCancellation } from './IEXCancellation'

type Props = {
  priceIntentId: string
  offer: ProductOfferFragment
}

export const CancellationForm = (props: Props) => {
  const { data } = usePriceIntentQuery({ variables: { priceIntentId: props.priceIntentId } })
  if (!data) throw new Error('Cancellation | Missing data')

  const productOfferIds = data.priceIntent.offers.map((item) => item.id)
  const [mutate] = useCancellationRequestedUpdateMutation()
  const handleAutoSwitchChange = (checked: boolean) => {
    mutate({ variables: { productOfferIds, requested: checked } })
  }

  const startDate = convertToDate(props.offer.startDate)
  const [updateStartDate] = useStartDateUpdateMutation()
  const handleChangeStartDate = (date: Date) => {
    updateStartDate({
      variables: {
        productOfferIds,
        startDate: formatAPIDate(date),
      },
    })
  }

  switch (props.offer.cancellation.option) {
    case ExternalInsuranceCancellationOption.None:
      return (
        <InputStartDay date={props.offer.startDate ?? undefined} onChange={handleChangeStartDate} />
      )

    case ExternalInsuranceCancellationOption.Iex:
      return (
        <IEXCancellation
          requested={props.offer.cancellation.requested}
          onAutoSwitchChange={handleAutoSwitchChange}
          companyName={props.offer.cancellation.externalInsurer?.displayName ?? ''}
          startDate={startDate ?? undefined}
          onStartDateChange={handleChangeStartDate}
        />
      )
  }
}
