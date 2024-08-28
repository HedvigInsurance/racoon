import { useMemo, useState } from 'react'
import { useClaim } from '../hooks/use-claim'
import { addMonths, parseISO } from 'date-fns'
import {
  ClaimState,
  InsuranceType,
  PaymentOrderState,
} from '../../config/constants'
import { usePaymentOrder } from '../../paymentOrders/hooks/use-payment-orders'
import styled from '@emotion/styled'
import { Flex, InfoTag, Monetary } from '@hedvig-ui'
import { ScheduleTaskModal } from '../../tasks/components/ScheduleTask'
import { TaskResourceType } from 'types/generated/graphql'
import { ExclamationCircle } from 'react-bootstrap-icons'
import { AssignClaimToAdmin } from './ClaimInformation/components/AssignClaimToAdmin'

const ClaimInfoTag = styled(InfoTag)`
  width: 100%;
  border-radius: 0.5rem;
  padding: 1rem;
`

const UnresolvedTasksIndicator = styled.div`
  position: absolute;
  top: -1.2rem;
  right: -1.2rem;
  border-radius: 100%;
  width: 1.2rem;
  background-color: red;
  color: white;
`
export const ClaimInformationTags = () => {
  const {
    memberId,
    claimId,
    claimState,
    assignedAdmin,
    claimRegistrationDate,
    subclaims,
    member,
    currentSubclaimId,
    tasks,
    refetch,
    contract,
    conversation,
  } = useClaim()

  const [scheduleTask, setScheduleTask] = useState(false)

  const [scheduledTasks, resolvedScheduledTasks, unresolvedScheduledTasks] =
    useMemo(() => {
      const scheduledTasks = tasks.filter(
        (task) => task.assignableFrom !== null,
      )
      return [
        scheduledTasks,
        scheduledTasks.filter((task) => task.resolvedAt !== null),
        scheduledTasks.filter((task) => task.resolvedAt === null),
      ]
    }, [tasks])

  const lastArea = useMemo(() => {
    if (tasks.length === 0) return null
    return (
      tasks
        .slice()
        .sort(
          (a, b) =>
            parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime(),
        )[0].area ?? null
    )
  }, [tasks])

  const noReserveSet =
    claimState !== ClaimState.Closed &&
    subclaims.some(({ reserve }) => !reserve.amount)

  const hasNonSettledPaymentOrders = subclaims.some(
    ({ paymentOrders }) =>
      !!paymentOrders.length &&
      paymentOrders.some(
        ({ state }) =>
          ![PaymentOrderState.Settled, PaymentOrderState.Dismissed].includes(
            state as PaymentOrderState,
          ),
      ),
  )

  const { getTransitionUser } = usePaymentOrder()

  const hasAutomationSettledPaymentOrder = subclaims.some(({ paymentOrders }) =>
    paymentOrders.some(
      (order) =>
        getTransitionUser(order, PaymentOrderState.Settled) == 'Automation',
    ),
  )

  const totalClaimPayout = subclaims
    .flatMap((subclaim) =>
      subclaim.paymentOrders.filter(
        ({ state }) => state === PaymentOrderState.Settled,
      ),
    )
    .reduce(
      (acc, { amount: { amount, currency } }) => {
        if (!acc.currency) {
          acc.currency = currency
        }
        acc.amount += amount

        return acc
      },
      {
        amount: 0,
        currency: '',
      },
    )

  const needsMajorClaimReport = (() => {
    const { currency, amount } = totalClaimPayout
    switch (currency) {
      case 'SEK':
        return amount > 500000
      case 'DKK':
        return amount > 316730
      case 'NOK':
        return amount > 502162
      default:
        return false
    }
  })()

  const needsReInsurerReport = (() => {
    const { currency, amount } = totalClaimPayout
    switch (currency) {
      case 'SEK':
        return amount > 5000000
      case 'DKK':
        return amount > 3167301
      case 'NOK':
        return amount > 5021626
      default:
        return false
    }
  })()

  const contractStartDate = currentSubclaimId
    ? contract?.masterInception
    : undefined

  const dateWithinSixMonthsOfStart = contractStartDate
    ? addMonths(
        new Date(claimRegistrationDate).getTime() -
          new Date(contractStartDate).getTime(),
        -6,
      ).getTime() < 0
    : undefined

  const contractInsuranceType = currentSubclaimId
    ? contract?.insuranceType
    : undefined
  const contractIsPet = contractInsuranceType
    ? [InsuranceType.SwedishCat, InsuranceType.SwedishDog].includes(
        contractInsuranceType as InsuranceType,
      )
    : false

  const market = member?.contractMarketInfo?.market

  return (
    <>
      {market && (
        <div
          onClick={() => setScheduleTask(true)}
          style={{ cursor: 'pointer' }}
        >
          {scheduledTasks.length ? (
            <ClaimInfoTag status="highlight">
              {!!unresolvedScheduledTasks.length && (
                <div style={{ position: 'relative' }}>
                  <UnresolvedTasksIndicator>
                    {unresolvedScheduledTasks.length}
                  </UnresolvedTasksIndicator>
                </div>
              )}
              <Flex gap="small">
                <span>
                  Scheduled tasks
                  {!!resolvedScheduledTasks.length && (
                    <span>
                      {' '}
                      - {resolvedScheduledTasks.length} /{' '}
                      {scheduledTasks.length}
                    </span>
                  )}
                </span>
              </Flex>
            </ClaimInfoTag>
          ) : (
            <ClaimInfoTag status="info">
              <Flex gap="small">
                <span>Schedule task +</span>
              </Flex>
            </ClaimInfoTag>
          )}
        </div>
      )}
      {market && (
        <ScheduleTaskModal
          scheduledTasks={scheduledTasks}
          memberId={memberId}
          resourceId={claimId}
          market={market}
          title={`${member?.firstName} ${member?.lastName}`}
          resourceType={TaskResourceType.Claim}
          area={lastArea}
          visible={scheduleTask}
          onClose={async () => {
            setScheduleTask(false)
            await refetch()
          }}
          conversationId={conversation?.id ?? null}
          claimId={claimId}
        />
      )}

      {noReserveSet && (
        <div>
          <ClaimInfoTag status="warning">
            <Flex gap="small">
              <ExclamationCircle />
              <span>This claim is missing reserves</span>
            </Flex>
          </ClaimInfoTag>
        </div>
      )}

      {hasNonSettledPaymentOrders && (
        <div>
          <ClaimInfoTag status="info">
            <Flex gap="small">
              <ExclamationCircle />
              <span>This claim has payment orders that are not settled</span>
            </Flex>
          </ClaimInfoTag>
        </div>
      )}

      {hasAutomationSettledPaymentOrder && (
        <div>
          <ClaimInfoTag status="success">
            <Flex gap="small">
              <ExclamationCircle />
              <span>This claim has been automatically paid out</span>
            </Flex>
          </ClaimInfoTag>
        </div>
      )}

      {dateWithinSixMonthsOfStart && contractIsPet && (
        <div>
          <ClaimInfoTag status="warning">
            <Flex gap="small">
              <ExclamationCircle />
              <span>
                This claim was reported within six months of signing the
                contract
              </span>
            </Flex>
          </ClaimInfoTag>
        </div>
      )}

      {needsMajorClaimReport && (
        <div>
          <ClaimInfoTag status="danger">
            <Flex align="center">
              <Flex gap="small">
                <ExclamationCircle />
                <span>
                  This claim has payouts of{' '}
                  <Monetary
                    amount={{
                      amount: String(totalClaimPayout.amount),
                      currency: totalClaimPayout.currency,
                    }}
                  />
                  , ensure{' '}
                  {needsReInsurerReport
                    ? 'this is reported to our re-insurers.'
                    : 'there is a Major-claim-report.'}
                </span>
              </Flex>
            </Flex>
          </ClaimInfoTag>
        </div>
      )}

      {assignedAdmin && (
        <div style={{ cursor: 'pointer' }}>
          <ClaimInfoTag status="highlight">
            <AssignClaimToAdmin>
              <Flex align="center">
                <Flex gap="small">
                  <ExclamationCircle />
                  <span>This claim is assigned to {assignedAdmin.name}</span>
                </Flex>
              </Flex>
            </AssignClaimToAdmin>
          </ClaimInfoTag>
        </div>
      )}
    </>
  )
}
