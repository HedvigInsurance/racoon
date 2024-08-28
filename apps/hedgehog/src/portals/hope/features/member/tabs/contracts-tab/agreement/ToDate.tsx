import {
  Button,
  ButtonsGroup,
  FourthLevelHeadline,
  Paragraph,
  Spacing,
  TextDatePicker,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  GenericAgreement,
  useChangeToDateMutation,
} from 'types/generated/graphql'
import { checkGapBetweenAgreements, DateSpan, DialogWarning } from './helpers'
import { getTodayFormatDate } from '@hope/features/member/tabs/contracts-tab/agreement/helpers'
import { HopeAuthGuard, hopeAuthPermissions } from 'auth'
import { ContractStatus } from '@hope/features/config/constants'

const initialToDate = (agreement: GenericAgreement): string =>
  agreement.toDate || getTodayFormatDate()

const getNextAgreement = (
  agreements: GenericAgreement[],
  selectedAgreement: GenericAgreement,
) =>
  agreements.reduce<GenericAgreement | null>((nextAgreement, current) => {
    if (
      selectedAgreement.toDate < current.fromDate &&
      (!nextAgreement || current.fromDate < nextAgreement.fromDate)
    ) {
      return current
    }

    return nextAgreement
  }, null)

export const ToDate: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [toDate, setToDate] = React.useState<string | null>(
    initialToDate(agreement),
  )
  const [changeToDate] = useChangeToDateMutation()
  const { confirm } = useConfirmDialog()

  const reset = () => {
    setToDate(initialToDate(agreement))
    setDatePickerEnabled(false)
  }

  const onConfirm = () => {
    let confirmText = (
      <>
        Do you wish to change the to date to <DateSpan>{toDate}</DateSpan>?
      </>
    )
    const nextAgreement = getNextAgreement(
      contract.genericAgreements,
      agreement,
    )

    if (nextAgreement && toDate) {
      if (checkGapBetweenAgreements(agreement, nextAgreement)) {
        const nextFromDate = new Date(toDate)
        nextFromDate.setDate(nextFromDate.getDate() + 1)

        const isoDate = parseISO(nextFromDate.toISOString())
        const formattedNextFromDate = formatDate(isoDate, 'yyyy-MM-dd')

        confirmText = (
          <>
            {confirmText}
            <DialogWarning>
              This will also change the from date of next agreement to{' '}
              <DateSpan>{formattedNextFromDate}</DateSpan>
            </DialogWarning>
          </>
        )
      }
    }
    confirm(confirmText).then(() => {
      toast.promise(
        changeToDate({
          variables: {
            agreementId: agreement.id,
            request: {
              newToDate: toDate,
            },
          },
        }),
        {
          loading: 'Changing date',
          success: () => {
            reset()
            return 'Date changed'
          },
          error: 'Could not change date',
        },
      )
    })
  }

  return (
    <>
      <ThirdLevelHeadline>To Date</ThirdLevelHeadline>
      {!datePickerEnabled && (
        <Spacing bottom width="auto">
          <FourthLevelHeadline>
            {agreement.toDate ?? 'Active'}
          </FourthLevelHeadline>
        </Spacing>
      )}
      {!datePickerEnabled &&
        agreement.toDate &&
        (!contract.terminationDate ? (
          <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
        ) : (
          contract.status !== ContractStatus.Deleted && (
            <HopeAuthGuard
              requires={
                hopeAuthPermissions.contracts['contracts:historic-changes']
              }
              noAccessContent={null}
              label="You are now accessing a restricted feature"
            >
              <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
            </HopeAuthGuard>
          )
        ))}
      {!datePickerEnabled && contract.terminationDate && (
        <Paragraph>Terminated</Paragraph>
      )}
      {datePickerEnabled && (
        <>
          <Spacing bottom width="auto">
            <TextDatePicker
              onChange={(date) => date && setToDate(date)}
              value={toDate}
            />
          </Spacing>
          <ButtonsGroup>
            <Button onClick={onConfirm}>Confirm</Button>
            <Button variant="tertiary" onClick={() => reset()}>
              Cancel
            </Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
