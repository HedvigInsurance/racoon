import { useClaim } from '../../../hooks/use-claim'
import {
  Button,
  Card,
  Flex,
  LegacyTooltip,
  Table,
  TableColumn,
  TableHeader,
  TableRow,
  TableRowStatus,
  TableRowStatusWithPopover,
} from '@hedvig-ui/redesign'
import { FirstVetAppointment } from 'types/generated/graphql'
import { ClaimContractType } from './ClaimContractType'
import { ClaimDate } from './ClaimDate'
import { IconButton } from '@hedvig-ui/icons'
import { CheckCircle, CheckCircleFill } from 'react-bootstrap-icons'
import { useClaimAppointmentConnection } from '@hope/features/claims/claim-details/MemberInformation/hooks/use-claim-appointment-connection'
import { Modal, PrettyPrintJSON } from '@hedvig-ui'
import { useState } from 'react'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const FirstVetHistory = () => {
  const { member } = useClaim()

  const appointments = member.firstVetAppointments.toSorted((a, b) => {
    if (a.journalComplete && b.journalComplete) {
      return b.journalComplete.date.localeCompare(a.journalComplete.date)
    }
    return -1
  })

  return (
    <Card className={cssUtil.tableCard}>
      <div className={cssUtil.tableCardTitle}>
        Journals ({appointments.length ?? 0})
      </div>
      {appointments.length > 0 && (
        <Table>
          <TableHeader>
            <TableColumn>State</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Contract</TableColumn>
            <TableColumn />
          </TableHeader>
          {appointments.map((appointment) => (
            <FirtVetHistoryRow key={appointment.id} appointment={appointment} />
          ))}
        </Table>
      )}
    </Card>
  )
}

const FirtVetHistoryRow = ({
  appointment,
}: {
  appointment: FirstVetAppointment
}) => {
  const [showJournalInfoModal, setShowJournalInfoModal] = useState(false)
  const { claimId, member } = useClaim()

  const insuranceType = member.contracts.find(
    (contract) => contract.id === appointment.contractId,
  )?.insuranceType

  return (
    <>
      <TableRow key={appointment.id}>
        <TableColumn>
          <FirstVetStatus claimId={claimId} appointment={appointment} />
        </TableColumn>
        <TableColumn>
          <ClaimDate date={appointment.journalComplete?.date} />
        </TableColumn>
        <TableColumn>
          <ClaimContractType insuranceType={insuranceType} />
        </TableColumn>
        <TableColumn>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              setShowJournalInfoModal(true)
            }}
          >
            View journal info
          </Button>
        </TableColumn>
      </TableRow>

      <Modal
        visible={showJournalInfoModal}
        onClose={() => setShowJournalInfoModal(false)}
        style={{
          width: '75vw',
          height: '75vh',
        }}
      >
        <PrettyPrintJSON
          name="appointment"
          collapsed={false}
          obj={{
            appointmentId: appointment.id,
            journal: appointment.journalComplete,
            invoice: appointment.invoiceComplete,
          }}
        />
      </Modal>
    </>
  )
}

const FirstVetStatus = ({
  claimId,
  appointment,
}: {
  claimId: string
  appointment: FirstVetAppointment
}) => {
  if (appointment.claimId === claimId) {
    return (
      <>
        <TableRowStatusWithPopover
          status="info"
          popoverContent="Connected to this claim"
        />
        <Flex gap="small" align="center">
          <FirstVetStatusButton claimId={claimId} appointment={appointment} />
          This claim
        </Flex>
      </>
    )
  } else if (appointment.claimId) {
    return (
      <>
        <TableRowStatusWithPopover
          status="success"
          popoverContent="Connected to other claim"
        />
        <Flex gap="small" align="center">
          <FirstVetStatusButton claimId={claimId} appointment={appointment} />
          Other claim
        </Flex>
      </>
    )
  }

  return (
    <>
      <TableRowStatus status="neutral" />
      <Flex gap="small" align="center">
        <FirstVetStatusButton claimId={claimId} appointment={appointment} />
        Not connected
      </Flex>
    </>
  )
}

const FirstVetStatusButton = ({
  claimId,
  appointment,
}: {
  claimId: string
  appointment: FirstVetAppointment
}) => {
  const { connectAppointmentToClaim, removeAppointmentFromClaim } =
    useClaimAppointmentConnection()
  const connectedToClaim = appointment.claimId === claimId

  if (connectedToClaim) {
    return (
      <LegacyTooltip content="Remove connection from this claim">
        <IconButton>
          <CheckCircleFill
            onClick={() =>
              removeAppointmentFromClaim({ appointmentId: appointment.id })
            }
          />
        </IconButton>
      </LegacyTooltip>
    )
  }

  return (
    <LegacyTooltip content="Connect to this claim">
      <IconButton>
        <CheckCircle
          onClick={() =>
            connectAppointmentToClaim({
              claimId,
              appointmentId: appointment.id,
            })
          }
        />
      </IconButton>
    </LegacyTooltip>
  )
}
