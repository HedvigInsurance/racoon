import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { useRouter } from 'next/router'
import { Button, Heading, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { MemberContractFragment } from '@/services/apollo/generated'
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
            <Space y={2}>
              <InsuranceCard key={contract.id} contract={contract} />
              <InsuranceTabs contract={contract} />
            </Space>
          </Overview>
        </div>
      )}
    </>
  )
}

type InsuranceTabsProps = {
  contract: MemberContractFragment
}

const InsuranceTabs = ({ contract }: InsuranceTabsProps) => {
  return (
    <RadixTabs.Tabs defaultValue="overview">
      <TabsList>
        <RadixTabs.Trigger asChild={true} value="overview">
          <TabButton variant="secondary" size="medium">
            Overview
          </TabButton>
        </RadixTabs.Trigger>
        <RadixTabs.Trigger asChild={true} value="coverage">
          <TabButton variant="secondary" size="medium">
            Coverage
          </TabButton>
        </RadixTabs.Trigger>
        <RadixTabs.Trigger asChild={true} value="documents">
          <TabButton variant="secondary" size="medium">
            Documents
          </TabButton>
        </RadixTabs.Trigger>
      </TabsList>

      <RadixTabs.TabsContent value="overview">
        <Heading as="h2" variant="standard.24" mt={theme.space.lg}>
          Overview
        </Heading>
        {contract.currentAgreement.displayItems.map((displayItem) => (
          <Row key={displayItem.displayTitle}>
            <Text size={{ _: 'sm', lg: 'md' }}>{displayItem.displayTitle}</Text>
            <Text color="textSecondary" size={{ _: 'sm', lg: 'md' }}>
              {displayItem.displayValue}
            </Text>
          </Row>
        ))}
      </RadixTabs.TabsContent>

      <RadixTabs.TabsContent value="coverage">Coverage</RadixTabs.TabsContent>

      <RadixTabs.TabsContent value="documents">
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
      </RadixTabs.TabsContent>
    </RadixTabs.Tabs>
  )
}

const TabsList = styled(RadixTabs.List)({
  display: 'flex',
  gap: theme.space.xs,
  marginBottom: theme.space.xs,
})

const TabButton = styled(Button)({
  flex: 1,
  '&[data-state=active]': {
    backgroundColor: theme.colors.translucent2,
  },
})

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
