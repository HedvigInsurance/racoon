import {
  Collapsible,
  convertEnumToTitle,
  Flex,
  MainHeadline,
  Modal,
  ModalProps,
  Monetary,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import React, { ComponentProps, useEffect, useState } from 'react'
import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { downloadHandler } from '../DownloadButton'
import {
  AdditionalPaymentData,
  generatePO3File,
  getBookkeepingDate,
} from 'utils/fileFormater'
import {
  Button,
  Div,
  Grid,
  Input,
  LabeledText,
  LegacyTooltip,
  Table,
  TableColumn,
  TableHeader,
  TableRow,
  TableRowStatus,
  TableRowStatusWithPopover,
} from '@hedvig-ui/redesign'
import { Divider } from '../styled'
import { Download, Link as LinkIcon } from 'react-bootstrap-icons'
import copy from 'copy-to-clipboard'
import toast from 'react-hot-toast'
import {
  cellSubtext,
  exportTableContent,
  infoText,
  modalWrapper,
} from './ExportPaymentsModal.css'
import { theme } from '@hedvig-ui/redesign/theme'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@hedvig-ui/icons'
import {
  PaymentAccounts,
  PaymentMethod,
  PaymentRecipientType,
} from '@hope/features/config/constants'
import { format } from 'date-fns'

interface IExportPaymentsModal extends ModalProps {
  orders: PaymentOrderInformationFragment[]
  toggleCheckedOrder: (order: PaymentOrderInformationFragment) => void
  setVisible: (close: boolean) => void
}
export const ExportPaymentsModal: React.FC<IExportPaymentsModal> = ({
  orders,
  toggleCheckedOrder,
  setVisible,
  ...props
}) => {
  const isSingleCurrency = orders.some(
    (o) => o?.amount?.currency === orders?.[0]?.amount?.currency,
  )
  const totalAmount =
    orders.length > 1 && !isSingleCurrency
      ? "Can't calculated mixed currencies"
      : `${orders.reduce((sum, o) => sum + o.amount.amount, 0).toFixed(2)} ${orders?.[0]?.amount?.currency}`

  const [fileContents, setFileContents] = useState({
    blob: new Blob(),
    content: '',
  })
  const [additionalData, setAdditionalData] = useState<AdditionalPaymentData>(
    {},
  )

  useEffect(() => {
    try {
      setFileContents(
        generatePO3File({
          senders: PaymentAccounts,
          payments: orders,
          additionalData: additionalData,
        }),
      )
    } catch (e) {
      const message =
        'message' in (e as Error)
          ? (e as Error).message
          : 'Something went wrong'
      setFileContents({ blob: new Blob(), content: `Error: ${message}` })
    }
  }, [orders, additionalData])

  return (
    <Modal {...props} className={modalWrapper} style={{ overflowY: 'scroll' }}>
      <Flex direction="column" gap="small">
        <MainHeadline>Exporting Payment Orders</MainHeadline>
        <Divider />
        <div style={{ width: '100%' }}>
          <Flex direction="row" wrap="wrap">
            <CarrierOrderCountTable orders={orders} />
            <FileContentsPreview fileContents={fileContents.content} />
          </Flex>
          <ThirdLevelHeadline
            style={{
              padding: `${theme.space.sm} 0`,
            }}
          >
            Payments to export
          </ThirdLevelHeadline>

          <Table className={exportTableContent}>
            <TableHeader
              style={{
                background: theme.colors.gray100,
                borderStartStartRadius: theme.radius.sm,
                borderStartEndRadius: theme.radius.sm,
              }}
              templateColumns="1fr 2fr 3fr 1fr max-content"
            >
              <TableColumn>Carrier</TableColumn>
              <TableColumn>Recipient</TableColumn>
              <TableColumn>Identifier</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>
                <span style={{ width: '16px', marginRight: '10px' }}></span>
              </TableColumn>
            </TableHeader>
            <div style={{ maxHeight: '390px', overflowY: 'scroll' }}>
              {orders.map((order, i) => (
                <ExportPaymentOrderTableRow
                  key={i}
                  order={order}
                  toggleCheckedOrder={toggleCheckedOrder}
                  additionalData={additionalData}
                  setAdditionalData={setAdditionalData}
                />
              ))}
            </div>
            <TableHeader
              style={{
                background: theme.colors.gray100,
                borderEndStartRadius: theme.radius.sm,
                borderEndEndRadius: theme.radius.sm,
                flexDirection: 'row-reverse',
              }}
            >
              <TableColumn
                style={{
                  justifyContent: 'flex-end',
                  marginRight: '10px',
                }}
              >
                <strong style={{ paddingRight: '1rem' }}>Total Amount:</strong>
                {orders.length > 0 ? totalAmount : 'No orders'}
              </TableColumn>
            </TableHeader>
          </Table>
          <Flex
            style={{
              flexDirection: 'row',
              gap: theme.space.xs,
            }}
          >
            <Button
              variant="primary"
              Icon={<Download />}
              disabled={!orders.length || !isSingleCurrency}
              onClick={() => {
                downloadHandler<Blob>({
                  data: fileContents.blob,
                  fileName: `nordea_${new Date().toLocaleDateString('sv-SE')}.txt`,
                  useConfirmation: false,
                })
                setVisible(false)
              }}
            >
              Export
            </Button>
            <Button
              variant="secondary"
              style={{ justifySelf: 'flex-end' }}
              onClick={() => setVisible(false)}
            >
              Close
            </Button>
          </Flex>
        </div>
      </Flex>
    </Modal>
  )
}

const FileContentsPreview = ({ fileContents }: { fileContents: string }) => {
  return (
    <Flex
      direction="column"
      style={{ width: 'fit-content', maxWidth: '620px' }}
    >
      <ThirdLevelHeadline
        style={{
          padding: `${theme.space.md} 0`,
        }}
      >
        File Preview
      </ThirdLevelHeadline>
      <Div
        p="md"
        style={{
          width: '100%',
          maxHeight: '10rem',
          minHeight: '4rem',
          whiteSpace: 'pre',
          border: '1px solid',
          overflow: 'scroll',
          borderRadius: theme.radius.sm,
          borderColor: theme.colors.gray200,
          backgroundColor: theme.colors.gray50,
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: theme.fontSizes.xxs,
            whiteSpace: 'pre',
          }}
        >
          {fileContents}
        </div>
      </Div>
    </Flex>
  )
}

const CarrierOrderCountTable = ({
  orders,
}: {
  orders: PaymentOrderInformationFragment[]
}) => {
  const carriers = orders.reduce(
    (acc, o) => {
      if (!acc[`${o.carrier}`]) {
        acc[`${o.carrier}`] = { orderCount: 0 }
      }
      acc[`${o.carrier}`].orderCount += 1
      return acc
    },
    {} as Record<string, { orderCount: number }>,
  )

  return (
    <Flex
      direction="column"
      style={{
        minWidth: 'fit-content',
      }}
    >
      <ThirdLevelHeadline
        style={{
          padding: `${theme.space.md} 0`,
        }}
      >
        Count by carrier
      </ThirdLevelHeadline>
      <Table
        style={{
          width: 'fit-content',
          padding: 0,
          minHeight: '10rem',
        }}
      >
        <TableRow
          style={{
            height: theme.space.xxl,
            background: theme.colors.gray100,
            fontWeight: 'bold',
          }}
        >
          <TableColumn>Carrier</TableColumn>
          <TableColumn>Count</TableColumn>
        </TableRow>
        {Object.entries(carriers).map((c, i) => (
          <TableRow
            key={i}
            style={{
              height: theme.space.xxl,
            }}
          >
            <TableRowStatus status="neutral" />
            <TableColumn
              style={{ background: theme.colors.gray100, fontWeight: 'bold' }}
            >
              {convertEnumToTitle(c?.[0])}
            </TableColumn>
            <TableColumn key={i}>{c?.[1]?.orderCount}</TableColumn>
          </TableRow>
        ))}
        <TableRow
          style={{
            height: theme.space.xxl,
          }}
        >
          <TableRowStatus status="neutral" />
          <TableColumn
            style={{ fontWeight: 'bold', background: theme.colors.gray100 }}
          >
            Total
          </TableColumn>
          <TableColumn style={{ fontWeight: 'bold' }}>
            {orders.length}
          </TableColumn>
        </TableRow>
      </Table>
    </Flex>
  )
}

function checkRowStatus({
  order,
  clearingNumber,
  bookkeepingDate,
}: {
  order: PaymentOrderInformationFragment
  clearingNumber?: string
  bookkeepingDate?: Date
}): {
  popoverContent: string
  status: ComponentProps<typeof TableRowStatus>['status']
} {
  if (
    ![
      PaymentMethod.BANKGIRO,
      PaymentMethod.PLUSGIRO,
      PaymentMethod.BANKACCOUNT,
    ].includes(order?.method as PaymentMethod)
  ) {
    return {
      status: 'danger',
      popoverContent: 'Only Bankgiro and Plusgiro methods are supported',
    }
  }
  if (
    order.recipientType !== PaymentRecipientType.INDIVIDUAL &&
    order.method === PaymentMethod.BANKACCOUNT &&
    !clearingNumber
  ) {
    return {
      status: 'danger',
      popoverContent:
        'Bank account transactions to companies require a clearing number',
    }
  }
  if (
    order?.method === PaymentMethod.BANKACCOUNT &&
    order?.recipientType === PaymentRecipientType.COMPANY &&
    !clearingNumber
  ) {
    return {
      status: 'warning',
      popoverContent:
        'Bank number transactions to Companies requires a specified clearing number',
    }
  }
  if (PaymentMethod.BANKGIRO === order?.method && !bookkeepingDate) {
    return {
      status: 'warning',
      popoverContent: 'Bankgiro requires bookkeeping date; Default applied.',
    }
  }
  return { status: 'neutral', popoverContent: 'No issues found' }
}

const ExportPaymentOrderTableRow = ({
  order,
  toggleCheckedOrder,
  additionalData,
  setAdditionalData,
}: {
  order: PaymentOrderInformationFragment
  toggleCheckedOrder: (order: PaymentOrderInformationFragment) => void
  additionalData: AdditionalPaymentData
  setAdditionalData: (data: AdditionalPaymentData) => void
}) => {
  const copyTextAndConfirm = (
    text: string | null | undefined,
    confirmText: string,
  ) => {
    if (!text) return
    copy(text)
    toast.success(`${confirmText} copied`)
  }

  const [showMenu, setShowMenu] = useState(false)

  const rowStatus = checkRowStatus({
    order,
    clearingNumber: additionalData?.[order.id]?.clearingNumber,
    bookkeepingDate: additionalData?.[order.id]?.bookkeepingDate,
  })

  return (
    <>
      <TableRow
        templateColumns="1fr 2fr 3fr 1fr min-content"
        onClick={() => {
          setShowMenu(!showMenu)
        }}
      >
        <TableRowStatusWithPopover {...rowStatus} />
        <TableColumn>{order.carrier}</TableColumn>
        <TableColumn>
          {order.subclaim.type ? (
            <>
              <span style={{ paddingRight: '5px' }}>{order.recipientName}</span>
              <LegacyTooltip content="Open in new tab">
                <Link
                  to={`/claims/${order.claimId}?subclaimId=${order.subclaim.id}`}
                  target="_blank"
                >
                  <LinkIcon />
                </Link>
              </LegacyTooltip>
            </>
          ) : (
            order.claimId
          )}
        </TableColumn>
        <TableColumn>
          {order.number ? (
            <Flex direction="column">
              <span
                className={infoText}
                onClick={(e) => {
                  e.stopPropagation()
                  copyTextAndConfirm(
                    order.number,
                    `${convertEnumToTitle(order.method)} number`,
                  )
                }}
              >
                {order.number}
              </span>
              <div className={cellSubtext}>
                {convertEnumToTitle(order.method)}
              </div>
            </Flex>
          ) : (
            convertEnumToTitle(order.method)
          )}
        </TableColumn>
        <TableColumn>
          <Monetary amount={order.amount} />
        </TableColumn>
        <TableColumn style={{ marginRight: '10px' }}>
          <ChevronDownIcon />
        </TableColumn>
      </TableRow>
      <Collapsible collapsed={!showMenu}>
        <Grid
          px="medium"
          pt="small"
          pb="large"
          templateColumns="2fr 1fr"
          style={{ background: theme.colors.gray50 }}
          gap={'lg'}
        >
          <Flex
            direction="column"
            justify="space-between"
            style={{
              borderRight: '1px solid',
              borderColor: theme.colors.gray200,
            }}
          >
            <Grid equalColumns={2} style={{ paddingBottom: '15px' }}>
              <LabeledText label="Claim id">{order.claimId}</LabeledText>

              <LabeledText label="Member ID">
                {convertEnumToTitle(order.member.memberId)}
              </LabeledText>

              {order.bankName && (
                <LabeledText label="bankName">{order.bankName}</LabeledText>
              )}
              {order.recipientType && (
                <LabeledText label="Recipient Type">
                  {convertEnumToTitle(order.recipientType)}
                </LabeledText>
              )}

              <LabeledText label="Payout Type">
                {convertEnumToTitle(order.costType)}
              </LabeledText>
            </Grid>

            <Grid equalColumns={2} style={{ paddingBottom: '15px' }}>
              <LabeledText label="Bookkeeping Date (YYYY-MM-DD)">
                <Input
                  required={order.method === PaymentMethod.BANKGIRO}
                  type="text"
                  defaultValue={
                    order.method === PaymentMethod.BANKGIRO
                      ? format(getBookkeepingDate(), 'yyyy-MM-dd')
                      : ''
                  }
                  style={{
                    width: '100%',
                  }}
                  onInput={(e) => {
                    e.preventDefault()
                    try {
                      const date = e?.currentTarget?.value
                        ? new Date(e?.currentTarget?.value)
                        : null
                      setAdditionalData({
                        ...additionalData,
                        [order.id]: date
                          ? {
                              bookkeepingDate: date,
                            }
                          : {},
                      })
                    } catch (e) {
                      toast.error('Invalid date format')
                    }
                  }}
                />
              </LabeledText>

              {order.recipientType !== PaymentRecipientType.INDIVIDUAL &&
                order.method === PaymentMethod.BANKACCOUNT && (
                  <LabeledText label="Clearing number">
                    <Input
                      required={true}
                      type="text"
                      style={{
                        width: '100%',
                      }}
                      onInput={(e) => {
                        e.preventDefault()
                        try {
                          setAdditionalData({
                            ...additionalData,
                            [order.id]:
                              Number(e?.currentTarget?.value) > 999
                                ? {
                                    clearingNumber: e?.currentTarget?.value,
                                  }
                                : {},
                          })
                        } catch (e) {
                          toast.error('Invalid clearing number')
                        }
                      }}
                    />
                  </LabeledText>
                )}
            </Grid>

            <Div pl="md" pr="lg" style={{ width: '100%' }}>
              <Button
                fullWidth
                onBeforeInput={(e) => {
                  e.preventDefault()
                  setShowMenu(false)
                }}
                onClick={() => {
                  toggleCheckedOrder(order)
                }}
              >
                Exclude Payment
              </Button>
            </Div>
          </Flex>
          <Flex direction="column">
            <ThirdLevelHeadline
              style={{ fontSize: theme.fontSizes.xxs, paddingTop: '10px' }}
            >
              Notes
            </ThirdLevelHeadline>
            {order.notes.map((n, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem 0.5rem 0.5rem 0',
                  width: '100%',
                }}
              >
                {n.text}
                <Div
                  style={{
                    fontSize: theme.fontSizes.xxs,
                    color: theme.colors.textSecondary,
                    textAlign: 'right',
                  }}
                >
                  {format(n.addedAt, 'yyyy-MM-dd')}
                </Div>
              </div>
            ))}
          </Flex>
        </Grid>
      </Collapsible>
    </>
  )
}
