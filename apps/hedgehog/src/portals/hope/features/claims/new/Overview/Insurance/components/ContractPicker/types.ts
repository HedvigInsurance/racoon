import { InfoTagVariant } from '@hedvig-ui/redesign/InfoTag/InfoTag'

export type ContractOption = {
  name: string
  contractId: string
  petName?: string
  registrationNumber?: string
  street?: string
  birthDate?: string
  fromDate: string
  toDate?: string
  tags: { text: string; variant: InfoTagVariant }[]
}
