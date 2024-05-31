import InsuranceSwitchExpirationDateForm from './InsuranceSwitchExpirationDateForm'

type Props = {
  params: { id: string }
}

export default function InsuranceSwitchExpirationDate({ params }: Props) {
  return <InsuranceSwitchExpirationDateForm id={params.id} />
}
