import { useEffect, useMemo, useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import {
  OrderItem,
  SelectedOrderSidePanel,
} from '@hope/pages/tools/payment-orders/components'
import { css } from '@emotion/react'
import {
  PaymentOrdersProvider,
  usePaymentOrders,
} from '@hope/features/paymentOrders/hooks/use-payment-orders'
import {
  Button,
  Flex,
  Input,
  PageManager,
  Popover,
  Spinner,
  convertEnumToSentence,
  useTitle,
} from '@hedvig-ui'
import {
  Carrier,
  Currency,
  CurrencyFlags,
  PaymentOrderOrigin,
  PaymentOrderState,
  PaymentRecipientType,
} from '@hope/features/config/constants'
import { motion } from 'framer-motion'
import { getCarrierText } from '@hope/features/contracts/utils'
import {
  CashCoin,
  CheckCircle,
  CheckSquare,
  CheckSquareFill,
  Trash,
} from 'react-bootstrap-icons'
import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { PaymentOrdersSettleMultipleModal } from './components/PaymentOrdersSettleMultipleModal'
import { ExportPaymentsModal } from './components/ExportPaymentsModal'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 100%;
  overflow: hidden;
`

const ListContainer = styled.div`
  background-color: white;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const FilterLabel = styled.div`
  width: 5rem;
`
const FilterBar = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  border-block: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};
`

const TopBarItem = styled.button<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;

  background-color: ${({ theme, selected }) =>
    selected ? theme.backgroundLight : 'transparent'};
  border: none;
  border-left: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};
  cursor: pointer;

  height: 5rem;
  padding: 0 2rem;

  color: ${({ theme, selected }) =>
    selected ? 1 : chroma(theme.semiStrongForeground).brighten(2).hex()};

  transition: color 200ms;
`

const List = styled.div`
  padding-bottom: 3rem;
  overflow-x: hidden;
  overflow-y: scroll;

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`

const ListRow = styled.div<{ checkable: boolean }>`
  display: grid;
  grid-template-columns:
    repeat(${({ checkable }) => (checkable ? 2 : 1)}, 1fr)
    repeat(9, 3fr) 1fr 1fr;
  gap: 1rem;
`

const ListHeader = styled(ListRow)`
  align-items: flex-end;
  font-weight: bold;
  font-size: 1rem;
  padding: 1rem 1.75rem 1rem 1rem;
  border-bottom: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};
`

const ListItem = styled(ListRow)<{
  selected?: boolean
  settled?: boolean
  approved?: boolean
  dismissed?: boolean
}>`
  background-color: ${({ settled, dismissed, approved, selected, theme }) =>
    selected
      ? chroma(theme.accent).alpha(0.2).brighten(1).hex()
      : settled
        ? theme.lightSuccess
        : dismissed
          ? theme.lightDanger
          : approved
            ? theme.lightWarning
            : undefined};

  align-items: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.medium};

  height: 4rem;

  padding: 0 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  ${({ selected, theme }) =>
    selected &&
    css`
      border: 1px solid ${theme.border};
      border-radius: 2px;
    `}

  transition: all 200ms;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent).alpha(0.2).brighten(2).hex()};
  }
`

const OrderContainer = styled.div`
  padding: 2rem;
  border-left: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};

  overflow-y: auto;

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`

const SpinnerWrapper = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
`

const FilterButton = styled(motion.button)<{
  selected: boolean
  small?: boolean
}>`
  border: none;
  display: inline-flex;
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent : theme.backgroundTransparent};
  padding: ${({ small }) => (!small ? '0.4em 0.7em' : '0.3em 0.6em')};
  border-radius: 6px;
  transition: all 50ms;
  cursor: pointer;
  color: ${({ theme, selected }) =>
    selected ? theme.accentContrast : theme.semiStrongForeground};
  font-family: inherit;
  font-size: ${({ small }) => (!small ? '16px' : '14px')};

  :hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.accent : theme.accentLight};
    color: ${({ theme, selected }) =>
      selected ? theme.accentLight : theme.accent};
  }
`

const PaymentOrderTabs = {
  All: '',
  ...Object.entries(PaymentOrderState).reduce(
    (acc, [key, value]) => {
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  ),
}

const PaymentOrdersPageInner: React.FC = () => {
  useTitle('Payment Orders')
  const {
    paymentOrders,
    state,
    filterState,
    loadingOrders,
    currentPage,
    totalPages,
    goToPage,
    currencies,
    carriers,
    toggleCurrency,
    toggleCarrier,
    origin,
    setOrigin,
    recipientTypes,
    toggleRecipientType,
    clearRecipientTypesFilter,
  } = usePaymentOrders()

  const [selectedOrderId, setSelectedOrderId] = useState(
    paymentOrders?.length > 0 ? paymentOrders[0].id : '',
  )

  const [settleMultipleModalVisible, setSettleMultipleModalVisible] =
    useState(false)
  const [exportPaymentsModalVisible, setExportPaymentsModalVisible] =
    useState(false)

  const [checkedOrders, setCheckedOrders] = useState<
    PaymentOrderInformationFragment[]
  >([])

  const stateSupportsChecking = (state: PaymentOrderState) => {
    return state === PaymentOrderState.Approved
  }
  const canCheckOrders = stateSupportsChecking(state as PaymentOrderState)

  const allOrdersChecked = checkedOrders.length === paymentOrders.length

  const toggleCheckedOrder = (order: PaymentOrderInformationFragment) => {
    setCheckedOrders((prev) =>
      prev.map(({ id }) => id).includes(order.id)
        ? prev.filter(({ id }) => id !== order.id)
        : [...prev, order],
    )
  }

  useEffect(() => {
    if (!paymentOrders.length) return
    if (paymentOrders.find(({ id }) => id === selectedOrderId)) return
    setSelectedOrderId(paymentOrders[0].id)
  }, [selectedOrderId, paymentOrders])

  const pageManagerPages = useMemo(() => {
    return [...Array(totalPages).keys()]
  }, [totalPages])

  return (
    <>
      <Wrapper>
        <ListContainer>
          <FilterBar>
            <Flex gap="small" align="center">
              <FilterLabel>Currency:</FilterLabel>
              {Object.values(Currency).map((currency) => (
                <FilterButton
                  key={currency}
                  selected={currencies.includes(currency)}
                  onClick={() => toggleCurrency(currency)}
                >
                  {CurrencyFlags[currency]} {currency}
                </FilterButton>
              ))}
              <Button
                variant="tertiary"
                onClick={() =>
                  currencies.forEach((currency) => toggleCurrency(currency))
                }
              >
                Clear
              </Button>
            </Flex>
            <Flex gap="small" align="center">
              <FilterLabel>Carrier:</FilterLabel>
              {Object.values(Carrier).map((carrier) => (
                <FilterButton
                  key={carrier}
                  selected={carriers.includes(carrier)}
                  onClick={() => {
                    toggleCarrier(carrier)
                  }}
                >
                  {getCarrierText(carrier)}
                </FilterButton>
              ))}
              <Button
                variant="tertiary"
                onClick={() =>
                  carriers.forEach((carrier) => toggleCarrier(carrier))
                }
              >
                Clear
              </Button>
            </Flex>
            <Flex gap="small" align="center">
              <FilterLabel>Origin:</FilterLabel>
              {Object.entries(PaymentOrderOrigin).map(
                ([displayName, value]) => (
                  <FilterButton
                    key={value}
                    selected={origin === value}
                    onClick={() => {
                      setOrigin((prev) => {
                        if (prev === value) {
                          return ''
                        }
                        return value
                      })
                    }}
                  >
                    {displayName}
                  </FilterButton>
                ),
              )}
              <Button variant="tertiary" onClick={() => setOrigin('')}>
                Clear
              </Button>
            </Flex>
            <Flex gap="small" align="center">
              <FilterLabel>Recipient type:</FilterLabel>
              {Object.values(PaymentRecipientType).map((value) => (
                <FilterButton
                  key={value}
                  selected={recipientTypes.includes(value)}
                  onClick={() => {
                    toggleRecipientType(value)
                  }}
                >
                  {convertEnumToSentence(value)}
                </FilterButton>
              ))}
              <Button variant="tertiary" onClick={clearRecipientTypesFilter}>
                Clear
              </Button>
            </Flex>

            {canCheckOrders && (
              <Flex gap="tiny" justify="space-between">
                <Button
                  disabled={!checkedOrders.length}
                  onClick={() => setSettleMultipleModalVisible(true)}
                >
                  Settle checked orders
                </Button>
                <Button
                  variant="primary"
                  disabled={!checkedOrders.length}
                  onClick={() => setExportPaymentsModalVisible(true)}
                >
                  Export checked orders
                </Button>
              </Flex>
            )}
          </FilterBar>
          <TopBar>
            {Object.entries(PaymentOrderTabs).map(([name, value]) => (
              <TopBarItem
                key={value}
                selected={value === state}
                onClick={() => {
                  if (!stateSupportsChecking(value as PaymentOrderState)) {
                    setCheckedOrders([])
                  }
                  filterState(value as PaymentOrderState)
                }}
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{name}</span>
                <span>
                  {value === PaymentOrderState.Approved ? (
                    <CheckCircle />
                  ) : value === PaymentOrderState.Settled ? (
                    <CashCoin />
                  ) : value === PaymentOrderState.Dismissed ? (
                    <Trash />
                  ) : (
                    ''
                  )}
                </span>
              </TopBarItem>
            ))}
          </TopBar>

          <ListHeader checkable={canCheckOrders}>
            {canCheckOrders && (
              <Flex justify="center">
                <Popover
                  contents={allOrdersChecked ? 'Uncheck all' : 'Check all'}
                >
                  <Button
                    style={{ padding: 0 }}
                    onClick={() => {
                      if (allOrdersChecked) {
                        setCheckedOrders([])
                      } else {
                        setCheckedOrders(paymentOrders)
                      }
                    }}
                    icon={
                      allOrdersChecked ? <CheckSquareFill /> : <CheckSquare />
                    }
                    variant="tertiary"
                  />
                </Popover>
              </Flex>
            )}
            <div />
            <div>Claim</div>
            <div>Timestamp</div>
            <div>Payment type</div>
            <div>Cost category</div>
            <div>Recipient</div>
            <div>Pay amount</div>
            <div>Bank</div>
            <div>Identifier</div>
            <div>Reference</div>
          </ListHeader>

          {loadingOrders ? (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          ) : (
            <List>
              {paymentOrders.map((order, index) => (
                <ListItem
                  checkable={canCheckOrders}
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  selected={selectedOrderId === order.id}
                  settled={order.state === PaymentOrderState.Settled}
                  approved={order.state === PaymentOrderState.Approved}
                  dismissed={order.state === PaymentOrderState.Dismissed}
                >
                  {canCheckOrders && (
                    <Input
                      type="checkbox"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      checked={checkedOrders
                        .map(({ id }) => id)
                        .includes(order.id)}
                      onChange={() => {
                        toggleCheckedOrder(order)
                      }}
                    />
                  )}
                  <OrderItem
                    warning={
                      paymentOrders.filter(
                        (o) => o.member.memberId === order.member.memberId,
                      ).length > 1
                    }
                    index={index}
                    order={order}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </ListContainer>

        <OrderContainer>
          <SelectedOrderSidePanel
            order={
              paymentOrders.find((order) => order.id === selectedOrderId) ??
              paymentOrders[0]
            }
          />
        </OrderContainer>

        <PageManager
          pages={pageManagerPages}
          currentPage={currentPage}
          onClick={goToPage}
        />
      </Wrapper>
      <PaymentOrdersSettleMultipleModal
        orders={checkedOrders}
        visible={settleMultipleModalVisible}
        onClose={() => setSettleMultipleModalVisible(false)}
      />
      <ExportPaymentsModal
        orders={checkedOrders}
        visible={exportPaymentsModalVisible}
        setVisible={setExportPaymentsModalVisible}
        toggleCheckedOrder={toggleCheckedOrder}
        onClose={() => setExportPaymentsModalVisible(false)}
      />
    </>
  )
}

export default function PaymentOrdersPage() {
  useTitle('Payment Orders')
  return (
    <PaymentOrdersProvider>
      <PaymentOrdersPageInner />
    </PaymentOrdersProvider>
  )
}
