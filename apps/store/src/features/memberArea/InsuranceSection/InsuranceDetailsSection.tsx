import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Button, Heading, Space, Text, theme } from 'ui'
import { InsuranceDocumentLink } from '@/components/InsuranceDocumentLink'
import { Perils } from '@/components/Perils/Perils'
import { MemberContractFragment } from '@/services/apollo/generated'
import { singleQueryParam } from '@/utils/singleQueryParam'
import { useMemberAreaInfo } from '../useMemberAreaInfo'
import { InsuranceCard } from './InsuranceCard'

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
  const { t } = useTranslation('memberArea')
  const { query } = useRouter()
  return (
    <RadixTabs.Tabs defaultValue={singleQueryParam(query, 'section') ?? 'overview'}>
      <TabsList>
        <RadixTabs.Trigger asChild={true} value="overview">
          <TabButton variant="secondary" size="medium">
            {t('INSURANCE_DETAILS_TAB_OVERVIEW')}
          </TabButton>
        </RadixTabs.Trigger>
        <RadixTabs.Trigger asChild={true} value="coverage">
          <TabButton variant="secondary" size="medium">
            {t('INSURANCE_DETAILS_TAB_COVERAGE')}
          </TabButton>
        </RadixTabs.Trigger>
        <RadixTabs.Trigger asChild={true} value="documents">
          <TabButton variant="secondary" size="medium">
            {t('INSURANCE_DETAILS_TAB_DOCUMENTS')}
          </TabButton>
        </RadixTabs.Trigger>
      </TabsList>

      <RadixTabs.TabsContent value="overview">
        <Heading as="h2" variant="standard.24" mt={theme.space.lg}>
          {t('INSURANCE_DETAILS_TAB_OVERVIEW')}
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

      <RadixTabs.TabsContent value="coverage">
        <Space y={1}>
          <div>
            {contract.currentAgreement.productVariant.insurableLimits.map((limit) => (
              <Row key={limit.label}>
                <Text size={{ _: 'sm', lg: 'md' }}>{limit.label}</Text>
                <Text color="textSecondary" size={{ _: 'sm', lg: 'md' }}>
                  {limit.limit}
                </Text>
              </Row>
            ))}
          </div>
          <Perils items={contract.currentAgreement.productVariant.perils} />
        </Space>
      </RadixTabs.TabsContent>

      <RadixTabs.TabsContent value="documents">
        <Documents currentAgreement={contract.currentAgreement} />
      </RadixTabs.TabsContent>
    </RadixTabs.Tabs>
  )
}

type Agreement = MemberContractFragment['currentAgreement']

const Documents = ({ currentAgreement }: { currentAgreement: Agreement }) => {
  const { t } = useTranslation('memberArea')
  return (
    <DocumentList>
      {currentAgreement.certificateUrl && (
        <InsuranceDocumentLink
          displayName={t('INSURANCE_DETAILS_CERTIFICATE_BUTTON')}
          url={currentAgreement.certificateUrl}
        />
      )}
      {currentAgreement.productVariant.documents.map((document) => (
        <InsuranceDocumentLink
          key={document.url}
          url={document.url}
          displayName={document.displayName}
        />
      ))}
    </DocumentList>
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

const DocumentList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
  marginTop: theme.space.lg,
})

const Row = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '3rem',

  ':not(:first-child)': {
    borderTop: '1px solid hsla(0, 0%, 7%, 0.1)',
  },
})
