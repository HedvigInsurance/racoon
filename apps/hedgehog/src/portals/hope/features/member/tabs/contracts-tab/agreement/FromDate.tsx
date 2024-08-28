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
import { formatDate } from 'date-fns/format'
import { parseISO } from 'date-fns'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  GenericAgreement,
  useChangeFromDateMutation,
} from 'types/generated/graphql'
import { checkGapBetweenAgreements, DateSpan, DialogWarning } from './helpers'
import { getTodayFormatDate } from '@hope/features/member/tabs/contracts-tab/agreement/helpers'
import { HopeAuthGuard, hopeAuthPermissions } from 'auth'

const initialFromDate = (agreement: GenericAgreement): string =>
  agreement.fromDate || getTodayFormatDate()

const getPreviousAgreement = (
  agreements: GenericAgreement[],
  selectedAgreement: GenericAgreement,
) =>
  agreements.reduce<GenericAgreement | null>((previousAgreement, current) => {
    if (
      current.toDate < selectedAgreement.fromDate &&
      (!previousAgreement || current.toDate > previousAgreement.toDate)
    ) {
      return current
    }
    return previousAgreement
  }, null)

export const FromDate: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = React.useState(false)
  const [fromDate, setFromDate] = React.useState<string | null>(
    initialFromDate(agreement),
  )
  const [changeFromDate] = useChangeFromDateMutation()
  const { confirm } = useConfirmDialog()

  const reset = () => {
    setFromDate(initialFromDate(agreement))
    setDatePickerEnabled(false)
  }

  const onConfirm = () => {
    let confirmText = (
      <>
        Do you wish to change from date to <DateSpan>{fromDate}</DateSpan>?
      </>
    )
    const previousAgreement = getPreviousAgreement(
      contract.genericAgreements,
      agreement,
    )

    if (previousAgreement && fromDate) {
      if (checkGapBetweenAgreements(previousAgreement, agreement)) {
        const previousToDate = new Date(fromDate)
        previousToDate.setDate(previousToDate.getDate() - 1)

        const isoDate = parseISO(previousToDate.toISOString())
        const formattedPreviousToDate = formatDate(isoDate, 'yyyy-MM-dd')

        confirmText = (
          <>
            {confirmText}
            <DialogWarning>
              This will also change the to date of previous agreement to{' '}
              <DateSpan>{formattedPreviousToDate}</DateSpan>
            </DialogWarning>
          </>
        )
      }
    }

    confirm(confirmText).then(() => {
      toast.promise(
        changeFromDate({
          variables: {
            agreementId: agreement.id,
            request: {
              newFromDate: fromDate,
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
      <ThirdLevelHeadline>From Date</ThirdLevelHeadline>
      {!datePickerEnabled && (
        <>
          <Spacing bottom width="auto">
            <FourthLevelHeadline>
              {agreement.fromDate ?? 'Not set'}
            </FourthLevelHeadline>
          </Spacing>
          {agreement.fromDate && !contract.terminationDate && (
            <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
          )}
          {contract.terminationDate && (
            <HopeAuthGuard
              requires={
                hopeAuthPermissions.contracts['contracts:historic-changes']
              }
              noAccessContent={<Paragraph>Terminated</Paragraph>}
              label="You are now accessing a restricted feature"
            >
              <Button onClick={() => setDatePickerEnabled(true)}>Edit</Button>
            </HopeAuthGuard>
          )}
        </>
      )}
      {datePickerEnabled && (
        <>
          <Spacing bottom width="auto">
            <TextDatePicker
              onChange={(date) => date && setFromDate(date)}
              value={fromDate}
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
