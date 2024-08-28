import { useState } from 'react'
import * as React from 'react'
import {
  ThirdLevelHeadline,
  Modal,
  Spacing,
  ButtonsGroup,
  Button,
  Input,
  Flex,
  Label,
  extractErrorMessage,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import {
  RecoveryInvoice,
  useSettleRecoveryInvoiceMutation,
  useUpdateRecoveryInvoiceContentMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { toast } from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { invoiceContentMarkup } from '@hope/features/claims/claim-details/ClaimCounterparty/util'
import { getTodayFormatDate } from '@hope/features/member/tabs/contracts-tab/agreement/helpers'

const InvoiceModalStyled = styled(Modal)`
  width: 46rem;
  padding: 15px;
  background-color: ${({ theme }) => theme.backgroundLight};
`

const Content = styled.div`
  width: 100%;

  padding: 15px 100px 25px 15px;

  background-color: ${({ theme }) => theme.background};
`

const Remark = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.placeholderColor};
`

gql`
  mutation updateRecoveryInvoiceContent(
    $recoveryInvoiceId: ID!
    $content: String!
  ) {
    recoveryInvoice_updateContent(
      recoveryInvoiceId: $recoveryInvoiceId
      content: $content
    ) {
      id
      content
    }
  }

  mutation SettleRecoveryInvoice(
    $recoveryInvoiceId: ID!
    $request: SettleRecoveryInvoiceInput!
  ) {
    recoveryInvoice_settle(
      recoveryInvoiceId: $recoveryInvoiceId
      request: $request
    ) {
      id
      isSettled
      paymentAmount
      paymentDate
      paymentSettledAt
      paymentSettledBy
    }
  }
`

const ModalHeader = ({
  title,
  handleClose,
}: {
  title: string
  handleClose: () => void
}) => (
  <Flex align="center" justify="space-between">
    <h3 style={{ margin: 0 }}>{title}</h3>
    <Button variant="tertiary" onClick={handleClose}>
      Close
    </Button>
  </Flex>
)

const InvoiceFromContent: React.FC<{
  visible: boolean
  onClose: () => void
  content: string
  invoice: RecoveryInvoice
}> = ({ visible, onClose, content, invoice }) => {
  const [showSettle, setShowSettle] = useState(false)
  const [amount, setAmount] = useState(+invoice.amount.amount)
  const [paymentDate, setPaymentDate] = useState<string>(getTodayFormatDate())
  const [settleRecoveryInvoice] = useSettleRecoveryInvoiceMutation()

  const handleSettle = () => {
    if (
      !invoice.id ||
      !invoice.amount.currency ||
      isNaN(amount) ||
      !paymentDate
    ) {
      return
    }
    settleRecoveryInvoice({
      variables: {
        recoveryInvoiceId: invoice.id,
        request: {
          paymentAmount: {
            amount,
            currency: invoice.amount.currency,
          },
          paymentDate,
        },
      },
      optimisticResponse: {
        recoveryInvoice_settle: {
          __typename: 'RecoveryInvoice',
          id: invoice.id,
          isSettled: true,
        },
      },
    }).catch((error) => {
      console.error(error)
      toast.error(extractErrorMessage(error.message))
    })
  }

  const handleClose = () => {
    onClose()
    setShowSettle(false)
  }

  return (
    <InvoiceModalStyled visible={visible} onClose={handleClose}>
      {showSettle ? (
        <>
          <ModalHeader title="Settle invoice" handleClose={handleClose} />
          <Input
            type="number"
            placeholder="How much did we reveive?"
            value={amount}
            onChange={({ currentTarget }) => setAmount(+currentTarget.value)}
            label="Settled amount"
            affix={{ content: invoice.amount.currency }}
          />
          <Spacing top="small" />
          <Label>Payment date</Label>
          <Input
            autoFocus
            type="date"
            placeholder="When did we receive the payment?"
            value={paymentDate}
            max={getTodayFormatDate()}
            onChange={({ currentTarget }) =>
              setPaymentDate(currentTarget.value)
            }
          />
          <ButtonsGroup style={{ marginTop: '1rem' }}>
            <Button
              disabled={
                !invoice.id ||
                !invoice.amount.currency ||
                isNaN(amount) ||
                !paymentDate
              }
              onClick={handleSettle}
            >
              Confirm
            </Button>
            <Button variant="tertiary" onClick={() => setShowSettle(false)}>
              Discard
            </Button>
          </ButtonsGroup>
        </>
      ) : (
        <>
          <ModalHeader title="Invoice" handleClose={handleClose} />
          <Spacing top="small" />
          <Content>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </Content>
          <Spacing top="small" />
          <ButtonsGroup>
            {!invoice.isSettled && (
              <Button onClick={() => setShowSettle(true)}>
                Settle invoice
              </Button>
            )}
            <Button
              variant="tertiary"
              onClick={() => {
                copy(content, { format: 'text/html' })
                toast.success('Content copied to clipboard')
              }}
            >
              Copy content
            </Button>
          </ButtonsGroup>
        </>
      )}
    </InvoiceModalStyled>
  )
}

const ConfirmContent: React.FC<{
  visible: boolean
  onClose: () => void
  invoice: RecoveryInvoice
}> = ({ visible, onClose, invoice }) => {
  const [updateRecoveryInvoiceContent] =
    useUpdateRecoveryInvoiceContentMutation()
  const content = invoiceContentMarkup(invoice)

  return (
    <InvoiceModalStyled visible={visible} onClose={onClose}>
      <ThirdLevelHeadline>Invoice Preview</ThirdLevelHeadline>
      <Remark>
        The information in this preview will be saved to the invoice when you
        click ‘Confirm’
      </Remark>
      <Spacing top="small" />
      <Content>
        <div
          style={{ userSelect: 'none' }}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </Content>
      <Spacing top="small" />
      <ButtonsGroup>
        <Button
          onClick={() =>
            toast.promise(
              updateRecoveryInvoiceContent({
                variables: {
                  recoveryInvoiceId: invoice.id,
                  content,
                },
              }),
              {
                loading: 'Setting content',
                success: `Content set for Invoice ${invoice.invoiceNumber}`,
                error: 'Could not set content',
              },
            )
          }
        >
          Confirm
        </Button>
        <Button variant="tertiary" onClick={onClose}>
          Discard
        </Button>
      </ButtonsGroup>
    </InvoiceModalStyled>
  )
}

export const InvoiceModal: React.FC<{
  visible: boolean
  onClose: () => void
  invoice: RecoveryInvoice
}> = ({ visible, onClose, invoice }) => {
  if (invoice?.content)
    return (
      <InvoiceFromContent
        visible={visible}
        onClose={onClose}
        content={invoice.content}
        invoice={invoice}
      />
    )

  return (
    <ConfirmContent visible={visible} onClose={onClose} invoice={invoice} />
  )
}
