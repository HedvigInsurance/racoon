import { isPast, isSameDay, startOfToday } from 'date-fns'
import { useCallback, useEffect, useMemo } from 'react'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import {
  type ProductOfferFragment,
  useCancellationRequestedUpdateMutation,
  usePriceIntentQuery,
  useStartDateUpdateMutation,
  ExternalInsuranceCancellationOption,
} from '@/services/graphql/generated'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { BankSigneringCancellation } from './BankSigneringCancellation'
import { BankSigneringInvalidRenewalDateCancellation } from './BankSigneringInvalidRenewalDateCancellation'
import { IEXCancellation } from './IEXCancellation'

type Props = {
  priceIntentId: string
  offer: ProductOfferFragment
}

const adjustPastDateToToday = (date?: Date | null) => {
  if (date && isPast(date)) {
    return startOfToday()
  }

  return date
}

export const CancellationForm = (props: Props) => {
  const { data } = usePriceIntentQuery({ variables: { priceIntentId: props.priceIntentId } })

  if (!data) throw new Error('Cancellation | Missing data')

  const productOfferIds = useMemo(
    () => data.priceIntent.offers.map((item) => item.id),
    [data.priceIntent.offers],
  )

  const [mutate] = useCancellationRequestedUpdateMutation()

  const handleAutoSwitchChange = (checked: boolean) => {
    mutate({ variables: { productOfferIds, requested: checked } })
  }

  const [updateStartDate, updateStartDateResult] = useStartDateUpdateMutation()

  const startDate = useMemo(
    () => convertToDate(props.offer.startDate) ?? undefined,
    [props.offer.startDate],
  )

  const handleChangeStartDate = useCallback(
    (date: Date) => {
      updateStartDate({
        variables: {
          productOfferIds,
          startDate: formatAPIDate(date),
        },
      })
    },
    [productOfferIds, updateStartDate],
  )

  const startDateProps = {
    startDate,
    onStartDateChange: handleChangeStartDate,
    loading: updateStartDateResult.loading,
  }

  const autoSwitchProps = {
    requested: props.offer.cancellation.requested,
    onAutoSwitchChange: handleAutoSwitchChange,
    companyName: props.offer.cancellation.externalInsurer?.displayName ?? 'Unknown',
  }

  // Update past offer start date to today
  useEffect(() => {
    const adjustedStartDate = adjustPastDateToToday(startDate)

    if (!startDate || !adjustedStartDate) {
      return
    }

    const isDifferentDate = !isSameDay(startDate, adjustedStartDate)

    if (isDifferentDate) {
      handleChangeStartDate(adjustedStartDate)
    }
  }, [handleChangeStartDate, startDate])

  switch (props.offer.cancellation.option) {
    case ExternalInsuranceCancellationOption.None:
      return (
        <InputStartDay
          date={startDate}
          onChange={handleChangeStartDate}
          loading={updateStartDateResult.loading}
        />
      )

    case ExternalInsuranceCancellationOption.Iex:
      return <IEXCancellation {...autoSwitchProps} {...startDateProps} />

    case ExternalInsuranceCancellationOption.Banksignering:
      return <BankSigneringCancellation {...autoSwitchProps} {...startDateProps} />

    case ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate:
      if (startDateProps.startDate === undefined) {
        throw new Error('Cancellation | Missing start date')
      }

      return (
        <BankSigneringInvalidRenewalDateCancellation
          {...startDateProps}
          startDate={startDateProps.startDate}
        />
      )
  }
}
