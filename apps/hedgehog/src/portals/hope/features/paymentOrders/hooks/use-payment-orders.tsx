import gql from 'graphql-tag'
import {
  PaymentOrderInformationFragment,
  SystemUserFragment,
  UpsertPaymentOrderInput,
  useAllPaymentOrdersLazyQuery,
  useApprovePaymentOrderMutation,
  useCreatePaymentOrderMutation,
  useDismissPaymentOrderMutation,
  useSettlePaymentOrderMutation,
  useSingleOrderQuery,
  useUpdatePaymentOrderMutation,
} from 'types/generated/graphql'
import {
  convertEnumToTitle,
  extractErrorMessage,
  Flex,
  useConfirmDialog,
  useLocalStorage,
} from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  ClaimState,
  CostCategory,
  PaymentMethod,
  PaymentOrderState,
  PaymentRecipientType,
} from '@hope/features/config/constants'
import { format, parseISO } from 'date-fns'
import { useSetClaimStatus } from '@hope/features/claims/hooks/useSetClaimStatus'
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'

gql`
  fragment PaymentOrderInformation on PaymentOrder {
    id
    claimId
    subclaim {
      id
      type
      reserve
      reserves {
        ...SubclaimReserve
      }
      recoveries {
        id
      }
    }
    member {
      memberId
      firstName
      lastName
      pickedLocale
      contractMarketInfo {
        market
        preferredCurrency
      }
      directDebitStatus {
        activated
      }
      payoutMethodStatus {
        activated
      }
      sanctionStatus
    }
    origin
    recipientName
    recipientType
    amount
    deductible
    costType
    costCategory
    type
    method
    carrier
    state
    createdAt
    createdBy
    createdByUser {
      __typename
      ... on AdminSystemUser {
        ...AdminSystemUser
      }
      ... on EmailSystemUser {
        id
        email
        name
      }
      ... on MemberSystemUser {
        memberId
      }
      ... on UnknownSystemUser {
        id
        name
      }
    }
    isExGratia
    sanctionListSkipped
    dueDate
    bankName
    bic
    number
    reference
    approvedAt
    approvedBy
    approvedByUser {
      __typename
      ... on AdminSystemUser {
        ...AdminSystemUser
      }
      ... on EmailSystemUser {
        id
        email
        name
      }
      ... on MemberSystemUser {
        memberId
      }
      ... on UnknownSystemUser {
        id
        name
      }
    }
    settledAt
    settledBy
    settledByUser {
      __typename
      ... on AdminSystemUser {
        ...AdminSystemUser
      }
      ... on EmailSystemUser {
        id
        email
        name
      }
      ... on MemberSystemUser {
        memberId
      }
      ... on UnknownSystemUser {
        id
        name
      }
    }
    settleAction
    payoutId
    dismissedAt
    dismissedBy
    dismissedByUser {
      __typename
      ... on AdminSystemUser {
        ...AdminSystemUser
      }
      ... on EmailSystemUser {
        id
        email
        name
      }
      ... on MemberSystemUser {
        memberId
      }
      ... on UnknownSystemUser {
        id
        name
      }
    }
    notes {
      text
      type
      addedByUser {
        __typename
        ... on AdminSystemUser {
          ...AdminSystemUser
        }
        ... on EmailSystemUser {
          id
          email
          name
        }
        ... on MemberSystemUser {
          memberId
        }
        ... on UnknownSystemUser {
          id
          name
        }
      }
      addedAt
    }
    transitionedAt
    correctsOrderId
    correctedByOrderId
  }

  mutation CreatePaymentOrder(
    $subclaimId: ID!
    $paymentOrder: UpsertPaymentOrderInput!
  ) {
    subclaim_createPaymentOrder(
      subclaimId: $subclaimId
      paymentOrder: $paymentOrder
    ) {
      id
      outcome
      paymentOrders {
        ...PaymentOrderInformation
      }
    }
  }

  mutation UpdatePaymentOrder(
    $orderId: ID!
    $paymentOrder: UpsertPaymentOrderInput!
  ) {
    paymentOrder_update(id: $orderId, input: $paymentOrder) {
      ...PaymentOrderInformation
    }
  }

  query AllPaymentOrders($input: ListPaymentOrdersInput!) {
    paymentOrders(input: $input) {
      orders {
        ...PaymentOrderInformation
      }
      page
      totalPages
      totalOrders
    }
  }

  query SingleOrder($id: ID!) {
    paymentOrder(orderId: $id) {
      ...PaymentOrderInformation
    }
  }

  mutation ApprovePaymentOrder($id: ID!) {
    paymentOrder_approve(id: $id) {
      ...PaymentOrderInformation
    }
  }

  mutation SettlePaymentOrder(
    $id: ID!
    $paidAt: Instant
    $sanctionListSkipped: Boolean
  ) {
    paymentOrder_settle(
      id: $id
      paidAt: $paidAt
      sanctionListSkipped: $sanctionListSkipped
    ) {
      ...PaymentOrderInformation
    }
  }

  mutation DismissPaymentOrder($id: ID!, $input: DismissPaymentOrderInput!) {
    paymentOrder_dismiss(id: $id, input: $input) {
      ...PaymentOrderInformation
    }
  }
`

export const useSinglePaymentOrder = (id: string) => {
  const { data, loading } = useSingleOrderQuery({
    variables: { id },
    skip: !id,
  })

  return {
    order: data?.paymentOrder,
    loading,
  }
}

export const usePaymentOrder = () => {
  const [createOrder, { loading: creating }] = useCreatePaymentOrderMutation()
  const [updateOrder, { loading: updating }] = useUpdatePaymentOrderMutation()
  const [approveOrder, { loading: approving }] =
    useApprovePaymentOrderMutation()
  const [settleOrder, { loading: settling }] = useSettlePaymentOrderMutation()
  const [dismissOrder, { loading: dismissing }] =
    useDismissPaymentOrderMutation()

  const { confirm, confirmWithValue } = useConfirmDialog()
  const { setStatus } = useSetClaimStatus()
  const { setReserve } = useSetSubclaimReserve()

  const adjustReserve = (
    order: PaymentOrderInformationFragment,
    alert: boolean = true,
  ) => {
    if (order.state !== PaymentOrderState.Settled) {
      throw new Error('Order not settled')
    }
    const reserve = order.subclaim.reserve
    if (reserve.amount > 0) {
      return setReserve(
        order.subclaim.id,
        order.subclaim.reserves,
        {
          amount: Math.max(0, reserve.amount - order.amount.amount),
          currency: order.amount.currency,
        },
        order.costCategory as CostCategory,
        undefined,
        alert,
      )
    }
    throw new Error('No reserve to adjust')
  }

  const createPaymentOrder = async (
    subclaimId: string,
    paymentOrder: UpsertPaymentOrderInput,
  ) => {
    const isCorrecting = !!paymentOrder.correctsOrderId
    await toast
      .promise(createOrder({ variables: { subclaimId, paymentOrder } }), {
        loading: `${
          isCorrecting ? 'Correcting' : 'Adding'
        } ${convertEnumToTitle(paymentOrder.method)} payment order`,
        success: `${convertEnumToTitle(paymentOrder.method)} payment order ${
          isCorrecting ? 'corrected' : 'added'
        }`,
        error: ({ message }) => extractErrorMessage(message),
      })
      .then((res) => {
        if (!res.data) return
        const paymentOrder =
          res.data.subclaim_createPaymentOrder.paymentOrders.slice(-1)[0]
        if (paymentOrder.state !== PaymentOrderState.Settled) return
        adjustReserve(paymentOrder)
      })
  }

  const updatePaymentOrder = async (
    orderId: string,
    paymentOrder: UpsertPaymentOrderInput,
  ) =>
    toast.promise(updateOrder({ variables: { orderId, paymentOrder } }), {
      loading: `Updating payment order`,
      success: `Payment order updated`,
      error: ({ message }) => extractErrorMessage(message),
    })

  const approvePaymentOrder = async (
    order: PaymentOrderInformationFragment,
  ) => {
    const {
      id,
      amount: { amount, currency },
    } = order
    return confirm(`Approve payment order of ${amount} ${currency}`).then(() =>
      toast.promise(approveOrder({ variables: { id } }), {
        loading: 'Approving',
        success: 'Order approved',
        error: ({ message }) => extractErrorMessage(message),
      }),
    )
  }
  const settlePaymentOrder = async (
    order: PaymentOrderInformationFragment,
    isPotentiallySanctioned: boolean,
  ) => {
    const {
      id,
      claimId,
      amount: { amount, currency },
    } = order
    return confirmWithValue({
      content: (
        <Flex direction="column" gap="small">
          <p style={{ margin: 0 }}>Settle payment order</p>
          <span style={{ fontSize: '1rem' }}>
            {order.method === PaymentMethod.AUTOGIRO
              ? `⚠️ Will execute automatic autogiro payment of ${amount} ${currency}`
              : '⚠️ Ensure payment has been performed'}
          </span>
        </Flex>
      ),
      values: {
        ...(order.method !== PaymentMethod.AUTOGIRO && {
          paidAt: {
            type: 'date',
            label: 'Paid at',
          },
        }),
        ...(isPotentiallySanctioned && {
          sanctionListSkipped: {
            type: 'checkbox',
            label: 'Skip sanction list',
          },
        }),
        closeClaim: {
          type: 'checkbox',
          label: 'Also close claim',
        },
      },
    }).then((values) => {
      const paidAt = new Date(values?.['paidAt'] as string)
      const closeClaim = values?.['closeClaim'] === true
      const sanctionListSkipped = values?.['sanctionListSkipped'] === true
      toast
        .promise(
          settleOrder({ variables: { id, paidAt, sanctionListSkipped } }),
          {
            loading: 'Settling',
            success: 'Order settled',
            error: ({ message }) => extractErrorMessage(message),
          },
        )
        .then(async (res) => {
          if (!res.data) return
          if (closeClaim) {
            return setStatus(claimId, ClaimState.Closed).catch(() =>
              adjustReserve(res.data!.paymentOrder_settle),
            )
          }
          return adjustReserve(res.data.paymentOrder_settle)
        })
    })
  }

  const dismissPaymentOrder = (id: string, note?: string) => {
    if (note) {
      return toast.promise(
        dismissOrder({ variables: { id, input: { note } } }),
        {
          loading: 'Dismissing',
          success: 'Order dismissed',
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    }

    confirmWithValue({
      content: 'Dismiss payment order',
      values: {
        note: {
          type: 'input',
          label: 'Reason...',
        },
      },
      status: 'danger',
      confirmText: 'Dismiss',
    }).then((values) => {
      const note = values?.['note'] as string
      return toast.promise(
        dismissOrder({ variables: { id, input: { note } } }),
        {
          loading: 'Dismissing',
          success: 'Order dismissed',
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    })
  }
  const createCorrectionOrder = async (
    paymentOrder: PaymentOrderInformationFragment,
  ) => {
    confirmWithValue({
      content: (
        <Flex direction="column" gap="small">
          <p style={{ margin: 0 }}>Correct payment order</p>
          <span style={{ fontSize: '1rem' }}>
            Enter {-paymentOrder.amount.amount} to confirm correction
          </span>
        </Flex>
      ),
      values: {
        confirmValue: {
          type: 'confirm',
          label: ``,
          required: true,
          confirmValue: (-paymentOrder.amount.amount).toString(),
        },
      },
      confirmText: 'Confirm',
    }).then(() => {
      return createPaymentOrder(paymentOrder.subclaim.id, {
        type: 'PAYOUT',
        carrier: paymentOrder.carrier,
        costType: paymentOrder.costType,
        costCategory: paymentOrder.costCategory,
        method: paymentOrder.method,
        number: paymentOrder.number,
        bankName: paymentOrder.bankName,
        bic: paymentOrder.bic,
        amount: {
          amount: -paymentOrder.amount.amount,
          currency: paymentOrder.amount.currency,
        },
        deductible: {
          amount: -paymentOrder.deductible.amount,
          currency: paymentOrder.deductible.currency,
        },
        isExGratia: paymentOrder.isExGratia,
        sanctionListSkipped: paymentOrder.sanctionListSkipped,
        note: `Correction for paymentOrder ${paymentOrder.id}`,
        recipientType: paymentOrder.recipientType,
        recipientName: paymentOrder.recipientName,
        reference: paymentOrder.reference,
        correctsOrderId: paymentOrder.id,
        dueDate: paymentOrder.dueDate,
      })
    })
  }

  const getTransitionedBy = (
    user?: SystemUserFragment | null,
  ): string | null =>
    !user
      ? null
      : user.__typename === 'AdminSystemUser' ||
          user.__typename === 'EmailSystemUser'
        ? user.email
        : 'Automation'

  const getTransitionUser = (
    order: PaymentOrderInformationFragment,
    state: PaymentOrderState,
  ): string | null =>
    state === 'REQUESTED'
      ? getTransitionedBy(order.createdByUser)
      : state === 'APPROVED'
        ? getTransitionedBy(order.approvedByUser)
        : state === 'DISMISSED'
          ? getTransitionedBy(order.dismissedByUser)
          : state === 'SETTLED'
            ? getTransitionedBy(order.settledByUser)
            : 'Not specified'

  const getTransitionTimestamp = (
    order: PaymentOrderInformationFragment,
    state: PaymentOrderState,
  ): string | null => {
    const timestamp =
      state === 'REQUESTED'
        ? order.createdAt
        : state === 'APPROVED'
          ? order.approvedAt
          : state === 'DISMISSED'
            ? order.dismissedAt
            : state === 'SETTLED'
              ? order.settledAt
              : null
    if (!timestamp) return 'Not specified'
    return format(parseISO(timestamp), 'yyyy-MM-dd HH:mm')
  }

  return {
    createPaymentOrder,
    updatePaymentOrder,
    approvePaymentOrder,
    settlePaymentOrder,
    dismissPaymentOrder,
    createCorrectionOrder,
    getTransitionUser,
    getTransitionTimestamp,
    adjustReserve,
    loading: creating || updating || approving || settling || dismissing,
  }
}

const usePaymentOrdersData = () => {
  const [getPaymentOrders, { data, loading }] = useAllPaymentOrdersLazyQuery()
  const paymentOrders = data?.paymentOrders?.orders ?? []
  const [page, setPage] = useState(0)
  const [prevTotalPages, setPrevTotalPages] = useState(page + 1)
  const totalPages = data?.paymentOrders?.totalPages ?? prevTotalPages
  const [state, setState] = useLocalStorage<PaymentOrderState | ''>(
    'payment-orders-tool-state',
    '',
  )
  const [currencies, setCurrencies] = useLocalStorage<string[]>(
    'payment-orders-tool-currencies',
    [],
  )
  const [carriers, setCarriers] = useLocalStorage<string[]>(
    'payment-orders-tool-carriers',
    [],
  )
  const [origin, setOrigin] = useLocalStorage<string>(
    'payment-orders-tool-origin',
    '',
  )
  const [recipientTypes, setRecipientTypes] = useLocalStorage<string[]>(
    'payment-orders-tool-recipient-types',
    [],
  )

  const {
    createPaymentOrder,
    approvePaymentOrder,
    settlePaymentOrder,
    dismissPaymentOrder,
  } = usePaymentOrder()

  const goToPage = useCallback((page: number) => {
    setPage(page)
  }, [])
  const filterState = useCallback(
    (state: PaymentOrderState) => {
      setPage(0)
      setState(state)
    },
    [setState],
  )
  const toggleCurrency = useCallback(
    (currency: string) => {
      setCurrencies((prev) => {
        if (prev.includes(currency)) {
          return prev.filter((curr) => curr !== currency)
        }
        return [...prev, currency]
      })
    },
    [setCurrencies],
  )
  const toggleCarrier = useCallback(
    (carrier: string) => {
      setCarriers((prev) => {
        if (prev.includes(carrier)) {
          return prev.filter((curr) => curr !== carrier)
        }
        return [...prev, carrier]
      })
    },
    [setCarriers],
  )
  const toggleRecipientType = useCallback(
    (recipientType: PaymentRecipientType) => {
      setRecipientTypes((prev) => {
        if (prev.includes(recipientType)) {
          return prev.filter((curr) => curr !== recipientType)
        }
        return [...prev, recipientType]
      })
    },
    [setRecipientTypes],
  )
  const clearRecipientTypesFilter = useCallback(() => {
    setRecipientTypes([])
  }, [setRecipientTypes])

  const getOrders = useCallback(async () => {
    await getPaymentOrders({
      variables: {
        input: {
          page,
          pageSize: 50,
          sortBy: null,
          sortDirection: null,
          currencies: currencies.length ? currencies : null,
          states: [state],
          carriers: carriers.length ? carriers : null,
          origin,
          recipientTypes,
        },
      },
    })
  }, [
    getPaymentOrders,
    page,
    state,
    carriers,
    currencies,
    origin,
    recipientTypes,
  ])

  useEffect(() => {
    setPrevTotalPages(totalPages)
  }, [totalPages])

  useEffect(() => {
    getOrders().then(null)
  }, [getOrders, page, state, currencies, carriers])

  return {
    paymentOrders,
    currentPage: page,
    totalPages,
    goToPage,
    state,
    filterState,
    currencies,
    carriers,
    toggleCurrency,
    toggleCarrier,
    origin,
    setOrigin,
    recipientTypes,
    toggleRecipientType,
    clearRecipientTypesFilter,
    loadingOrders: loading,
    createPaymentOrder,
    approvePaymentOrder,
    settlePaymentOrder,
    dismissPaymentOrder,
  }
}

type UsePaymentOrdersDataReturnType = ReturnType<typeof usePaymentOrdersData>

const PaymentOrdersContext = createContext<UsePaymentOrdersDataReturnType>({
  paymentOrders: [],
  currentPage: 0,
  totalPages: 0,
  goToPage: () => null,
  state: '',
  filterState: () => null,
  currencies: [],
  carriers: [],
  toggleCurrency: () => null,
  toggleCarrier: () => null,
  origin,
  setOrigin: () => null,
  recipientTypes: [],
  toggleRecipientType: () => null,
  clearRecipientTypesFilter: () => null,
  loadingOrders: false,
  createPaymentOrder: () => new Promise(() => null),
  approvePaymentOrder: () => new Promise(() => null),
  settlePaymentOrder: () => new Promise(() => null),
  dismissPaymentOrder: () => new Promise(() => null),
})

export const PaymentOrdersProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const paymentOrdersData = usePaymentOrdersData()
  return (
    <PaymentOrdersContext.Provider value={paymentOrdersData}>
      {children}
    </PaymentOrdersContext.Provider>
  )
}

export const usePaymentOrders = () => useContext(PaymentOrdersContext)
