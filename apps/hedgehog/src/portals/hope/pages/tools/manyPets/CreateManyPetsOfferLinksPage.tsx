import { Button, Copyable, Flex, InfoSection, Label, Spinner } from '@hedvig-ui'
import {
  ManyPetsLink,
  useCreateManyPetsOfferLinksMutation,
} from 'types/generated/graphql'
import { ApolloError } from '@apollo/client'

const DisplayLinks = ({
  links,
  loading,
  error,
}: {
  links?: ManyPetsLink[]
  loading: boolean
  error?: ApolloError
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

  if (links !== undefined) {
    if (!links.length) {
      return <InfoSection>No migration info found for this SSN</InfoSection>
    }
    return (
      <>
        {links.map(({ url, pets }) => (
          <InfoSection key={url}>
            <Flex direction="column" gap="small">
              <div>
                <Label>Pet names</Label>
                <p>{pets.join(', ')}</p>
              </div>
              <div>
                <Label>Migration link</Label>
                <Copyable textLabel={url} textValue={url} />
              </div>
            </Flex>
          </InfoSection>
        ))}
      </>
    )
  }

  return null
}

const CreateAndDisplayMigrationLink = ({ ssn }: { ssn: string }) => {
  const [createLinks, { data, loading, error }] =
    useCreateManyPetsOfferLinksMutation({
      variables: {
        ssn,
      },
    })

  return (
    <Flex direction="column" gap="small">
      <Button onClick={() => createLinks()}>Create links</Button>
      <DisplayLinks
        links={data?.manyPetsOfferLinks_create}
        loading={loading}
        error={error}
      />
    </Flex>
  )
}

export { CreateAndDisplayMigrationLink, DisplayLinks }
