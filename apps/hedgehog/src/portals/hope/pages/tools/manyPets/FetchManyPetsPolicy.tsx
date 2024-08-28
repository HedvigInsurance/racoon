import { useState } from 'react'
import {
  Button,
  Card,
  Flex,
  InfoSection,
  Input,
  Label,
  Spinner,
} from '@hedvig-ui'
import { ManyPetsPolicy } from 'types/generated/graphql'
import { ApolloError } from '@apollo/client'
import { CreateAndDisplayMigrationLink } from '@hope/pages/tools/manyPets/CreateManyPetsOfferLinksPage'
import { SetNewManyPetsPolicyOwner } from '@hope/pages/tools/manyPets/SetNewOwnerAndCreateOfferLink'
import { ResetManyPetsPolicyState } from '@hope/pages/tools/manyPets/ResetManyPetsPolicyState'

const DisplayManyPetsPolicy = ({
  data,
  error,
  loading,
}: {
  data?: ManyPetsPolicy[]
  error?: ApolloError
  loading: boolean
}) => {
  if (loading) {
    return (
      <InfoSection>
        <Spinner />
      </InfoSection>
    )
  }

  if (error !== undefined) {
    return (
      <InfoSection>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </InfoSection>
    )
  }

  if (!data?.length) {
    return <InfoSection>No policy found for this SSN</InfoSection>
  }

  return (
    <>
      {data.map((item, index) => (
        <Card key={index}>
          <Flex direction="column" gap="small">
            <h2>Policy info</h2>
            <Flex direction="row" gap="huge">
              <div>
                <Label>Name</Label>
                <p>{item.name}</p>
                <Label>Ssn</Label>
                <p>{item.ssn}</p>
              </div>
              <div>
                <Label>Address</Label>
                <p>{item.address}</p>
                <Label>Email</Label>
                <p>{item.email}</p>
              </div>
              <div>
                <Label>Phone number</Label>
                <p>{item.phoneNumber}</p>
                <Label>Renewal date</Label>
                <p>{item.renewalDate}</p>
              </div>
              <div>
                <Label>Policy State</Label>
                <p>{item.state}</p>
              </div>
            </Flex>
            <div>
              <Flex direction="row" gap="medium">
                <CreateAndDisplayMigrationLink ssn={item.ssn} />
                <SetNewManyPetsPolicyOwner policyId={item.policyId} />
                <ResetManyPetsPolicyState policyId={item.policyId} />
              </Flex>
            </div>
          </Flex>
        </Card>
      ))}
    </>
  )
}

const FetchManyPetsPolicy = ({
  onSubmit,
}: {
  onSubmit: (ssn: string) => void
}) => {
  const [ssn, setSsn] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(ssn)
      }}
    >
      <Flex direction="column" gap="small">
        <Input
          label="Ssn"
          placeholder="Input ssn..."
          value={ssn}
          onChange={({ currentTarget: { value } }) => setSsn(value)}
        />
        <Button type="submit">Fetch policy information</Button>
      </Flex>
    </form>
  )
}

export { FetchManyPetsPolicy, DisplayManyPetsPolicy }
