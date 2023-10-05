import styled from '@emotion/styled'
import { Heading, mq } from 'ui'
import { MemberAreaMemberInfoQuery } from '@/services/apollo/generated'
import { InsuranceCard } from './InsuranceCard'

type MemberInfoProps = {
  data: MemberAreaMemberInfoQuery
}

export const Insurances = ({ data }: MemberInfoProps) => {
  const { currentMember } = data
  const greeting = `Hello, ${currentMember.firstName} ${currentMember.lastName}`
  return (
    <>
      <Heading as={'h2'} variant="standard.32">
        {greeting}
      </Heading>
      <Heading as="h1" variant="standard.32">
        Your insurances
      </Heading>
      <Grid>
        {data.currentMember.activeContracts.map((contract) => (
          <InsuranceCard key={contract.id} contract={contract} />
        ))}
      </Grid>
    </>
  )
}

const Grid = styled.div({
  display: 'grid',
  gridGap: '1rem',
  marginTop: '1rem',

  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
})
