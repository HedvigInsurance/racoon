import { addYears } from 'date-fns'
import gql from 'graphql-tag'
import { useMemo } from 'react'
import { useMemberClaimPaymentsQuery } from 'types/generated/graphql'
import { InsuranceType } from '../../config/constants'
import { getOneYearMasterInceptionBuckets } from '../../contracts/utils'

gql`
  query MemberClaimPayments($memberId: ID!) {
    member(id: $memberId) {
      memberId
      claims {
        id
        contract {
          insuranceType
        }
        subclaims {
          paymentOrders {
            amount
            deductible
            settledAt
          }
        }
      }
    }
  }
`

export const useMemberClaimPayments = ({ memberId }: { memberId: string }) => {
  const { data: { member } = {} } = useMemberClaimPaymentsQuery({
    variables: { memberId },
  })

  const insuranceTypePayments = useMemo(() => {
    if (!member) return undefined
    return member.claims.reduce(
      (acc, claim) => {
        const claimPaymentPerInsuranceType = claim.subclaims.reduce(
          (payments, subclaim) => {
            const insuranceType = claim.contract?.insuranceType as InsuranceType
            if (!insuranceType) return payments
            payments[insuranceType] = [
              ...(payments[insuranceType] ?? []),
              ...subclaim.paymentOrders
                .filter(({ settledAt }) => Boolean(settledAt))
                .map(
                  ({
                    amount: { amount, currency },
                    deductible: { amount: deductible },
                    settledAt: date,
                  }) => ({
                    amount,
                    deductible,
                    currency,
                    date: new Date(date),
                  }),
                ),
            ]
            return payments
          },
          {} as Record<InsuranceType, Payment[]>,
        )

        Object.entries(claimPaymentPerInsuranceType).forEach(
          ([key, paymentOrders]) => {
            const insuranceType = key as InsuranceType
            if (acc[insuranceType]) {
              acc[insuranceType] = [...acc[insuranceType], ...paymentOrders]
            } else {
              acc[insuranceType] = paymentOrders
            }
          },
        )

        return acc
      },
      {} as Record<InsuranceType, Payment[]>,
    )
  }, [member])

  const getCurrentBucketPayments = ({
    masterInception,
    claimDate,
  }: {
    masterInception?: Date
    claimDate?: Date
  }): InsuranceTypeBucketPayments | undefined => {
    const contractDateBuckets = getOneYearMasterInceptionBuckets(
      masterInception ?? addYears(new Date(), -1),
    )
    const currentDateBucket = claimDate
      ? contractDateBuckets.find(
          ({ from, to }) => from <= claimDate && claimDate < to,
        )
      : undefined
    if (!currentDateBucket || !insuranceTypePayments) return undefined

    return Object.entries(insuranceTypePayments).reduce(
      (acc, [key, orders]) => {
        const insuranceType = key as InsuranceType
        const currentPayments = currentDateBucket
          ? orders.filter(
              ({ date }) =>
                currentDateBucket.from <= date && date < currentDateBucket.to,
            )
          : []

        const current = {
          from: currentDateBucket?.from,
          to: currentDateBucket?.to,
          payments: currentPayments,
          currency: currentPayments?.[0]?.currency,
          amountSum: currentPayments.reduce(
            (sum, { amount }) => sum + amount,
            0,
          ),
          deductibleSum: currentPayments.reduce(
            (sum, { deductible }) => sum + deductible,
            0,
          ),
        }

        acc[insuranceType] = current

        return acc
      },
      {} as InsuranceTypeBucketPayments,
    )
  }

  const getCurrentBucketPaymentsByInsuranceTypes = (
    insuranceTypes: InsuranceType[],
    {
      masterInception,
      claimDate,
    }: {
      masterInception: Date
      claimDate: Date
    },
  ): BucketPayments | undefined => {
    const contractDateBuckets =
      getOneYearMasterInceptionBuckets(masterInception)
    const currentDateBucket = contractDateBuckets.find(
      ({ from, to }) => from <= claimDate && claimDate < to,
    )
    if (!currentDateBucket || !insuranceTypePayments) return undefined

    return Object.entries(insuranceTypePayments).reduce(
      (acc, [key, orders]) => {
        const insuranceType = key as InsuranceType
        const currentPayments = currentDateBucket
          ? orders.filter(
              ({ date }) =>
                currentDateBucket.from <= date && date < currentDateBucket.to,
            )
          : []

        if (insuranceTypes.includes(insuranceType)) {
          acc.from = currentDateBucket?.from
          acc.to = currentDateBucket?.to
          acc.payments = [...acc.payments, ...currentPayments]
          acc.currency = currentPayments?.[0]?.currency
          acc.amountSum =
            acc.amountSum +
            currentPayments.reduce(
              (amountSum, { amount }) => amountSum + amount,
              0,
            )
          acc.deductibleSum =
            acc.deductibleSum +
            currentPayments.reduce(
              (deductibleSum, { deductible }) => deductibleSum + deductible,
              0,
            )
        }
        return acc
      },
      {
        from: undefined,
        to: undefined,
        payments: [],
        currency: '',
        amountSum: 0,
        deductibleSum: 0,
      } as BucketPayments,
    )
  }

  return {
    insuranceTypePayments,
    getCurrentBucketPayments,
    getCurrentBucketPaymentsByInsuranceTypes,
  }
}

type Payment = {
  amount: number
  deductible: number
  currency: string
  date: Date
}

export type BucketPayments = {
  from?: Date
  to?: Date
  payments: Payment[]
  currency: string
  amountSum: number
  deductibleSum: number
}

export type InsuranceTypeBucketPayments = Record<InsuranceType, BucketPayments>
