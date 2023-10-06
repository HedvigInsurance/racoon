import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { Heading, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { useMemberAreaInfo } from '../useMemberAreaInfo'
import { InsuranceCard } from './InsuranceCard'
import { TravelCertificateButton } from './TravelCertificateButton'

export const InsuranceDetailsSection = () => {
  const { query } = useRouter()
  const { activeContracts } = useMemberAreaInfo()
  const contract = activeContracts.find((contract) => contract.id === query.id)

  return (
    <>
      {contract && (
        <div>
          <Overview>
            <InsuranceCard key={contract.id} contract={contract} />

            <Heading as="h2" variant="standard.24" mt={theme.space.lg}>
              Overview
            </Heading>
            <div>
              {contract.currentAgreement.displayItems.map((displayItem) => (
                <Row key={displayItem.displayTitle}>
                  <Text size={{ _: 'sm', lg: 'md' }}>{displayItem.displayTitle}</Text>
                  <Text size={{ _: 'sm', lg: 'md' }}>{displayItem.displayValue}</Text>
                </Row>
              ))}
            </div>
            <Documents>
              {contract.currentAgreement.certificateUrl && (
                <ButtonNextLink
                  href={contract.currentAgreement.certificateUrl}
                  target="_blank"
                  variant="secondary"
                  size="small"
                >
                  Insurance certificate
                </ButtonNextLink>
              )}
              <TravelCertificateButton contractId={contract.id} />
            </Documents>
          </Overview>
        </div>
      )}
    </>
  )
}

const Overview = styled.div({ maxWidth: '400px' })

const Documents = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.space.md,
  marginTop: theme.space.lg,
})

const Row = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '3rem',
  ':not(:last-child)': {
    borderBottom: '1px solid hsla(0, 0%, 7%, 0.1)',
  },
})
