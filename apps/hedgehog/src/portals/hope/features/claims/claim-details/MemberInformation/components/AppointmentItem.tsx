import { useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { formatDate } from 'date-fns/format'
import { parseISO } from 'date-fns'
import { convertEnumToTitle, Modal, PrettyPrintJSON } from '@hedvig-ui'
import { useClaim } from '../../../hooks/use-claim'
import { FirstVetAppointment } from 'types/generated/graphql'
import { useClaimAppointmentConnection } from '../hooks/use-claim-appointment-connection'
import { useTheme } from '@emotion/react'

const JournalItemWrapper = styled.div`
  cursor: pointer;
  transition: background-color 200ms;

  margin-bottom: 0.5rem;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent).brighten(1.5).alpha(0.3).hex()};
  }

  width: 100%;
  border-radius: 0.5rem;
  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(0.5).alpha(0.15).hex()};

  padding: 0.75rem;
`

const StyledJournalInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    :nth-of-type(2) {
      text-align: right;
    }

    h5 {
      font-size: 1rem;
      padding: 0;
      margin: 0;
    }

    span {
      font-size: 0.9rem;
    }
  }
`

const StyledJournalText = styled.i`
  margin-top: 0.5rem;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 0.9rem;
`

function getTextFromAppointment(appointment: Appointment): string | undefined {
  const journal = appointment?.journalComplete
  if (!journal) {
    return undefined
  }
  return (
    journal?.anamnesis ??
    journal?.currentStatus ??
    journal?.diagnosis ??
    journal?.recommendation ??
    journal?.acuteness ??
    journal?.prescription
  )
}

export type Appointment = FirstVetAppointment

export const AppointmentItem = ({
  appointment,
}: {
  appointment: FirstVetAppointment
}) => {
  const { member, claimId } = useClaim()
  const { connectAppointmentToClaim, removeAppointmentFromClaim } =
    useClaimAppointmentConnection()
  const appointmentId = appointment.id
  const [showJournalInfoModal, setShowJournalInfoModal] = useState(false)

  const applicableContract = member.contracts.find(
    ({ id }) => id === appointment.contractId,
  )

  const startAtDateString = formatDate(
    parseISO(appointment.journalComplete?.date),
    'dd MMMM, yyyy',
  )
  const startAtTimeString = formatDate(
    parseISO(appointment.journalComplete?.date),
    'HH:mm',
  )

  const isConnectedToThisClaim = appointment.claimId === claimId

  const journalText = getTextFromAppointment(appointment)
  return (
    <>
      <Modal
        visible={showJournalInfoModal}
        onClose={() => setShowJournalInfoModal(false)}
        style={{
          width: '50vw',
          height: '50vh',
          padding: 0,
        }}
      >
        <PrettyPrintJSON
          name="appointment"
          collapsed={false}
          obj={{
            appointmentId,
            journal: appointment.journalComplete,
            invoice: appointment.invoiceComplete,
          }}
        />
      </Modal>
      <div
        onClick={() => setShowJournalInfoModal(true)}
        style={{ display: 'flex' }}
      >
        <JournalItemWrapper>
          <StyledJournalInfo>
            <div>
              <h5>
                {applicableContract?.insuranceType
                  ? convertEnumToTitle(applicableContract.insuranceType)
                  : 'No insurance type'}
              </h5>
            </div>

            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <div>
                <h5>{startAtDateString}</h5>
                <span>{startAtTimeString}</span>
              </div>
              <Checkbox
                size="large"
                checked={isConnectedToThisClaim}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isConnectedToThisClaim) {
                    removeAppointmentFromClaim({
                      appointmentId,
                    })
                  } else {
                    connectAppointmentToClaim({
                      claimId,
                      appointmentId,
                    })
                  }
                }}
              />
            </div>
          </StyledJournalInfo>
          {!!journalText && (
            <StyledJournalText>{journalText}</StyledJournalText>
          )}
        </JournalItemWrapper>
      </div>
    </>
  )
}

type TSize = 'small' | 'medium' | 'large'

const sizeStyle = (size: TSize) => {
  switch (size) {
    case 'small':
      return {
        width: '0.75rem',
        height: '0.75rem',
      }
    case 'medium':
      return {
        width: '1rem',
        height: '1rem',
      }

    case 'large':
      return {
        width: '1.5rem',
        height: '1.5rem',
      }
  }
}

const Checkbox = ({
  checked,
  size = 'medium',
  onClick,
}: {
  checked: boolean
  size?: TSize
  onClick: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}) => {
  const theme = useTheme()
  const CheckboxStyle = {
    accentColor: theme.accent,
    ...sizeStyle(size),
  }

  return (
    <input
      onClick={onClick}
      type="checkbox"
      checked={checked}
      readOnly
      style={CheckboxStyle}
    />
  )
}
