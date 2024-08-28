import gql from 'graphql-tag'
import { Button, extractErrorMessage, Flex, MainHeadline } from '@hedvig-ui'
import { EntrypointsProvider } from './context'
import styled from '@emotion/styled'
import { AddEntrypoint, EntrypointList, Sidebar } from './components'
import { usePopulateEntrypointSearchIndexesMutation } from 'types/generated/graphql'
import toast from 'react-hot-toast'

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  font-size: 1rem;
  height: 100%;
`

const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  padding-left: 1rem;
`

gql`
  mutation PopulateEntrypointSearchIndexes {
    entrypoint_populateSearchIndexes
  }
`

const EntrypointsPageComponent = () => {
  const [populateSearchIndexes] = usePopulateEntrypointSearchIndexesMutation()
  return (
    <>
      <Layout>
        <Sidebar />
        <Container>
          <Flex justify="space-between" flex="0">
            <MainHeadline>Entrypoints</MainHeadline>
            <Flex flex="0">
              <Button
                variant="tertiary"
                onClick={() => window.open('/demo/triaging', '_blank')}
              >
                Test search
              </Button>
              <Button
                onClick={() =>
                  toast.promise(populateSearchIndexes(), {
                    success: 'Populated!',
                    loading: 'Populating...',
                    error: ({ message }) => extractErrorMessage(message),
                  })
                }
              >
                Populate search indexes
              </Button>
            </Flex>
          </Flex>
          <AddEntrypoint />
          <EntrypointList />
        </Container>
      </Layout>
    </>
  )
}

export default function EntrypointsPage() {
  return (
    <EntrypointsProvider>
      <EntrypointsPageComponent />
    </EntrypointsProvider>
  )
}
