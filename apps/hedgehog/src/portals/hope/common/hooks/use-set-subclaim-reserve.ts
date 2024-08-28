import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'
import {
  AddReserveInput,
  ClaimDetailsDocument,
  ClaimSubclaimFragment,
  SubclaimReserveFragment,
  UpdateReserveInput,
  useAddSubclaimReserveMutation,
  useSetSubclaimReserveMutation,
  useUpdateSubclaimReserveMutation,
} from 'types/generated/graphql'
import { CostCategory } from '../../features/config/constants'
import { MonetaryAmount } from 'types/scalars'

gql`
  mutation SetSubclaimReserve($subclaimId: ID!, $amount: MonetaryAmount!) {
    subclaim_setReserve(subclaimId: $subclaimId, amount: $amount) {
      id
      reserve
    }
  }
  mutation AddSubclaimReserve($subclaimId: ID!, $request: AddReserveInput!) {
    subclaim_addReserve(subclaimId: $subclaimId, request: $request) {
      ...ClaimSubclaim
    }
  }
  mutation UpdateSubclaimReserve(
    $reserveId: ID!
    $request: UpdateReserveInput!
  ) {
    reserve_update(reserveId: $reserveId, request: $request) {
      ...SubclaimReserve
    }
  }
`

export const useSetSubclaimReserve = () => {
  const [setReserve] = useSetSubclaimReserveMutation()
  const [addSubclaimReserveMutation, { loading: isAddingReserve }] =
    useAddSubclaimReserveMutation()
  const [updateSubclaimReserveMutation, { loading: isUpdatingReserve }] =
    useUpdateSubclaimReserveMutation()

  const addReserve = async (subclaimId: string, reserve: AddReserveInput) => {
    await toast.promise(
      addSubclaimReserveMutation({
        variables: { subclaimId, request: reserve },
      }),
      {
        loading: 'Adding reserve',
        success: 'Reserve added',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const maybeUpdateSubclaimReserves = async ({
    subclaims,
    preferredCurrency,
  }: {
    subclaims: ClaimSubclaimFragment[]
    preferredCurrency: string
  }) => {
    for (const subclaim of subclaims) {
      await addDefaultReserve({ subclaim, preferredCurrency })
    }
  }

  const addDefaultReserve = async ({
    subclaim,
    preferredCurrency,
  }: {
    subclaim: ClaimSubclaimFragment
    preferredCurrency: string
  }) => {
    const hasReserve = !!subclaim.reserves.length
    const claimType = subclaim.claimType

    if (hasReserve) {
      return
    }
    if (!claimType?.defaultReserve) {
      toast(
        `No default reserve available${
          claimType?.displayName ? `for ${claimType?.displayName}` : ''
        }`,
        {
          icon: 'ℹ️',
        },
      )
      return
    }
    await addReserve(subclaim.id, {
      costCategory: CostCategory['Not specified'],
      amount: {
        amount: claimType.defaultReserve,
        currency: preferredCurrency,
      },
      note: `Default reserve for ${claimType.displayName}`,
    })
  }

  const updateReserve = (
    reserveId: string,
    reserve: UpdateReserveInput,
    alert: boolean = true,
  ) => {
    if (alert) {
      return toast.promise(
        updateSubclaimReserveMutation({
          variables: { reserveId, request: reserve },
          refetchQueries: [{ query: ClaimDetailsDocument }],
        }),
        {
          loading: 'Updating reserve',
          success: 'Reserve updated',
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    }
    return updateSubclaimReserveMutation({
      variables: { reserveId, request: reserve },
      refetchQueries: [{ query: ClaimDetailsDocument }],
    })
  }

  const setReserveHandler = async (
    subclaimId: string,
    subclaimReserves: SubclaimReserveFragment[],
    amount: MonetaryAmount,
    costCategory?: CostCategory,
    note?: string,
    alert: boolean = true,
  ) => {
    if (!amount.currency) {
      const message = `Something went wrong fetching this member's preferred currency`
      if (alert) {
        return toast.error(message)
      }
      throw new Error(message)
    }
    const standardReserve = subclaimReserves.find(
      (reserve) => reserve.costCategory === CostCategory['Not specified'],
    )
    const totalReserve = subclaimReserves.reduce(
      (sum, reserve) => sum + reserve.amount.amount,
      0,
    )

    const nonStandard = standardReserve
      ? totalReserve - standardReserve.amount.amount
      : totalReserve

    const categoryReserve = subclaimReserves.find(
      (reserve) => reserve.costCategory === costCategory,
    )

    const reserveNote = note ? note : 'Update'

    if (categoryReserve) {
      const addedOrDeductedReserve = amount.amount - totalReserve
      const newCategoryReserve =
        categoryReserve.amount.amount + addedOrDeductedReserve

      await updateReserve(
        categoryReserve.id,
        {
          amount: {
            amount: Math.max(newCategoryReserve, 0),
            currency: amount.currency,
          },
          note: reserveNote,
          costCategory: categoryReserve.costCategory,
        },
        alert,
      )
      if (newCategoryReserve < 0 && standardReserve) {
        return updateReserve(
          standardReserve.id,
          {
            amount: {
              amount: Math.max(
                standardReserve.amount.amount + newCategoryReserve,
                0,
              ),
              currency: amount.currency,
            },
            note: reserveNote,
            costCategory: CostCategory['Not specified'],
          },
          alert,
        )
      }
    } else if (standardReserve) {
      return updateReserve(
        standardReserve.id,
        {
          amount: {
            amount: Math.max(Number(amount.amount) - nonStandard, 0),
            currency: amount.currency,
          },
          note: reserveNote,
          costCategory: CostCategory['Not specified'],
        },
        alert,
      )
    } else {
      if (alert) {
        return toast.promise(
          setReserve({
            variables: {
              subclaimId,
              amount,
            },
            optimisticResponse: {
              subclaim_setReserve: {
                id: subclaimId,
                __typename: 'Subclaim',
                reserve: amount,
              },
            },
          }),
          {
            success: `Reserve updated to ${amount.amount} ${amount.currency}`,
            loading: 'Updating reserve',
            error: ({ message }) => extractErrorMessage(message),
          },
        )
      }
      return setReserve({
        variables: {
          subclaimId,
          amount,
        },
        optimisticResponse: {
          subclaim_setReserve: {
            id: subclaimId,
            __typename: 'Subclaim',
            reserve: amount,
          },
        },
      })
    }
  }

  return {
    setReserve: setReserveHandler,
    maybeUpdateSubclaimReserves,
    addReserve,
    isAddingReserve,
    addDefaultReserve,
    updateReserve,
    isUpdatingReserve,
  }
}
