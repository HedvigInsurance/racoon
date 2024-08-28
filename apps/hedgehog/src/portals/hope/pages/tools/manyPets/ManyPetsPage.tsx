import * as React from 'react'
import { Flex, InfoSection } from '@hedvig-ui'
import { useFetchManyPetsPolicyLazyQuery } from 'types/generated/graphql'
import {
  FetchManyPetsPolicy,
  DisplayManyPetsPolicy,
} from './FetchManyPetsPolicy'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  padding: 2rem;
`

const ManyPetsPage: React.FC = () => {
  const [fetchPolicy, { data, loading, error }] =
    useFetchManyPetsPolicyLazyQuery()

  const getLinks = (ssn: string) => {
    if (!ssn.trim().length) return
    fetchPolicy({ variables: { ssn } })
  }

  return (
    <Wrapper>
      <h1>Create ManyPets offer links</h1>
      <p></p>
      {data ? (
        <Flex direction="column" gap="small">
          <InfoSection>
            <DisplayManyPetsPolicy
              data={data.fetchManyPetsPolicies}
              loading={loading}
              error={error}
            />
          </InfoSection>
        </Flex>
      ) : (
        <FetchManyPetsPolicy onSubmit={getLinks} />
      )}
    </Wrapper>
  )
}

export default ManyPetsPage
