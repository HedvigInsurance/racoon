import styled from '@emotion/styled'
import { Button, Input, MainHeadline, Spacing, useTitle } from '@hedvig-ui'
import gql from 'graphql-tag'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  useTerminateStagingContractsMutation,
  useUnsignMemberMutation,
} from 'types/generated/graphql'

gql`
  mutation UnsignMember($ssn: String, $email: String) {
    unsignMember(ssn: $ssn, email: $email)
  }

  mutation TerminateStagingContracts($ssn: String, $email: String) {
    terminateContracts(ssn: $ssn, email: $email)
  }
`

const Wrapper = styled.div`
  padding: 2rem;
`

const UnsignMemberPage: React.FC = () => {
  const [ssn, setSsn] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [unsignMember, unsignResult] = useUnsignMemberMutation()
  const loadingUnsign = unsignResult.loading
  const [terminateContracts, terminateContractsResult] =
    useTerminateStagingContractsMutation()
  const loadingTerminateContracts = terminateContractsResult.loading

  useTitle('Tools | Unsign Member')

  return (
    <Wrapper>
      <MainHeadline>Unsign member</MainHeadline>
      <Input
        value={ssn}
        onChange={({ target: { value } }) => {
          setSsn(value)
        }}
        placeholder="Social Security Number"
        style={{ width: '300px' }}
      />
      <Input
        value={email}
        onChange={({ target: { value } }) => {
          setEmail(value)
        }}
        placeholder="Email"
        style={{ width: '300px' }}
      />

      <Spacing top="small" />
      <div>
        <Button
          variant="primary"
          disabled={
            loadingUnsign ||
            loadingTerminateContracts ||
            (ssn === '' && email === '')
          }
          onClick={() => {
            toast.promise(
              unsignMember({
                variables: {
                  ssn,
                  email,
                },
              }),
              {
                loading: 'Unsigning member',
                success: 'Member unsigned',
                error: 'Could not unsign member',
              },
            )
          }}
        >
          Unsign and terminate contracts
        </Button>
        <Spacing top="small" />
        <Button
          variant="primary"
          disabled={
            loadingUnsign ||
            loadingTerminateContracts ||
            (ssn === '' && email === '')
          }
          onClick={() => {
            toast.promise(
              terminateContracts({
                variables: {
                  ssn,
                  email,
                },
              }),
              {
                loading: 'Terminating contracts',
                success: 'Contracts terminated',
                error: 'Could not terminate contracts',
              },
            )
          }}
        >
          Terminate contracts, keep signed
        </Button>
      </div>
    </Wrapper>
  )
}

export default UnsignMemberPage
