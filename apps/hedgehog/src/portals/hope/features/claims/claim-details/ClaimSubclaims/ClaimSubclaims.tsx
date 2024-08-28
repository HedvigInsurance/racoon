import styled from '@emotion/styled'
import {
  CardContent,
  CardTitle,
  convertEnumToTitle,
  Flex,
  Tab,
} from '@hedvig-ui'
import {
  AddSubclaim,
  Subclaim,
} from '@hope/features/claims/claim-details/ClaimSubclaims/components'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

const TabsWrapper = styled(Flex)`
  align-items: flex-end;
  overflow: hidden;
  margin: 1rem 0;
`

const FillWithBorder = styled.div`
  width: 100%;
  flex-shrink: 0;
  ${({ theme }) => `
    border-bottom: 1px solid ${theme.border};
  `}
`
export const ClaimSubclaims = () => {
  const { subclaims, currentSubclaimId, setCurrentSubclaimId, getSubclaim } =
    useClaim()

  const selectedSubclaim = currentSubclaimId
    ? getSubclaim(currentSubclaimId)
    : undefined

  if (!selectedSubclaim) {
    return null
  }

  return (
    <CardContent>
      <Flex direction="column" gap="small">
        <Flex align="center" justify="space-between">
          <CardTitle title="Subclaims" />
          <AddSubclaim onSuccess={(id: string) => setCurrentSubclaimId(id)} />
        </Flex>
        <TabsWrapper>
          {subclaims.map((subclaim) => (
            <Tab
              key={subclaim.id}
              style={{ padding: '0 1rem 0.5rem 1rem' }}
              active={subclaim.id === currentSubclaimId}
              action={() => {
                setCurrentSubclaimId(subclaim.id)
              }}
              title={
                subclaim?.type ? convertEnumToTitle(subclaim.type) : 'Untitled'
              }
            />
          ))}
          <FillWithBorder />
        </TabsWrapper>

        <Subclaim subclaim={selectedSubclaim} />
      </Flex>
    </CardContent>
  )
}
