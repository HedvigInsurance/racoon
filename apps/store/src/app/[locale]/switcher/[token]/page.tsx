import InsuranceSwitchExpirationDateForm from './InsuranceSwitchExpirationDateForm'

export default function InsuranceSwitchExpirationDate({ params }: { params: { token: string } }) {
  return <InsuranceSwitchExpirationDateForm switchToken={params.token} />
}
