import styled from '@emotion/styled'
import { Label } from '@hedvig-ui'
import { AppointmentItem, type Appointment } from './AppointmentItem'

const AppointmentSection = styled.div`
  &:not(:first-of-type) {
    margin-top: 1rem;
  }
`

export const AppointmentsList = ({
  title,
  appointments,
}: {
  title: string
  appointments: Appointment[]
}) => (
  <AppointmentSection>
    <Label>{title}</Label>
    <div style={{ marginBottom: '0.25rem' }} />
    {appointments.map((appointment: Appointment) => (
      <AppointmentItem key={appointment.id} appointment={appointment} />
    ))}
  </AppointmentSection>
)
