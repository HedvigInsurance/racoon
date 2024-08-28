import { Button, ThirdLevelHeadline } from '@hedvig-ui'
import {
  Contract,
  useGetContractSwitcherCaseQuery,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { Flex } from '@hedvig-ui/redesign'

gql`
  query GetContractSwitcherCase($contractId: ID!) {
    contract(id: $contractId) {
      switcherCase {
        currentInsurer
        mandatePdfUrl
      }
    }
  }
`

export function ContractSwitching({ contract }: { contract: Contract }) {
  const { data } = useGetContractSwitcherCaseQuery({
    variables: { contractId: contract.id },
  })
  const sc = data?.contract.switcherCase

  const downloadMandate = () => {
    window.open(sc!.mandatePdfUrl!, '_blank')
  }

  return (
    <Flex direction="column" gap="sm">
      <ThirdLevelHeadline>Switching</ThirdLevelHeadline>
      {sc ? `Switched from ${sc.currentInsurer}` : 'Not a switcher'}
      {sc?.mandatePdfUrl && (
        <Button onClick={downloadMandate}>Download mandate</Button>
      )}
    </Flex>
  )
}
