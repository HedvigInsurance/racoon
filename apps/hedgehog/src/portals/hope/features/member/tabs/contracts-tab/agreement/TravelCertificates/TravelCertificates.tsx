import { ThirdLevelHeadline, Flex } from '@hedvig-ui'
import { Contract } from 'types/generated/graphql'
import { CreateTravelCertificate } from './CreateTravelCertificate'
import { TravelCertificatesTable } from './TravelCertificatesTable'

type TravelCertificateProps = {
  contract: Contract
}

export const TravelCertificates = (props: TravelCertificateProps) => {
  return (
    <>
      <Flex justify="space-between">
        <ThirdLevelHeadline>Travel Certificates</ThirdLevelHeadline>
        <CreateTravelCertificate contractId={props.contract.id} />
      </Flex>
      <TravelCertificatesTable
        certificates={props.contract.travelCertificates}
      />
    </>
  )
}
