import { useMemo } from 'react'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { AppointmentsList } from './AppointmentsList'
import { type Appointment } from './AppointmentItem'

export const MemberAppointmentsView = () => {
  const {
    claimId,
    member: { firstVetAppointments: appointments },
  } = useClaim()

  const thisClaimAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment: Appointment) => appointment.claimId === claimId,
      ),
    [appointments, claimId],
  )
  const nonConnectedAppointments = useMemo(
    () =>
      appointments.filter((appointment: Appointment) => !appointment.claimId),
    [appointments],
  )
  const otherClaimAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment: Appointment) =>
          !!appointment.claimId && appointment.claimId !== claimId,
      ),
    [appointments, claimId],
  )

  return (
    <>
      {!!thisClaimAppointments.length && (
        <AppointmentsList
          title="This claim"
          appointments={thisClaimAppointments}
        />
      )}
      {!!nonConnectedAppointments.length && (
        <AppointmentsList
          title="Not connected"
          appointments={nonConnectedAppointments}
        />
      )}
      {!!otherClaimAppointments.length && (
        <AppointmentsList
          title="Other claims"
          appointments={otherClaimAppointments}
        />
      )}
    </>
  )
}
