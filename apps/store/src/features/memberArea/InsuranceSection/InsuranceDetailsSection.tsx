import * as RadixTabs from '@radix-ui/react-tabs'
import router, { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Heading, Space, Text } from 'ui'
import { InsuranceDocumentLink } from '@/components/InsuranceDocumentLink'
import { Perils } from '@/components/Perils/Perils'
import type { MemberContractFragment } from '@/services/graphql/generated'
import { singleQueryParam } from '@/utils/singleQueryParam'
import { useMemberAreaInfo } from '../useMemberAreaInfo'
import { InsuranceCard } from './InsuranceCard'
import { tabList, tabButton, overview, documentsList, row } from './InsuranceDetailsSection.css'

const SECTION_QUERY_PARAM = 'section'

export const InsuranceDetailsSection = () => {
  const { query } = useRouter()
  const { activeContracts } = useMemberAreaInfo()
  const contract = activeContracts.find((contract) => contract.id === query.id)

  return (
    <>
      {contract && (
        <div className={overview}>
          <Space y={2}>
            <InsuranceCard key={contract.id} contract={contract} />
            <InsuranceTabs contract={contract} />
          </Space>
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

  const handleTabChange = useCallback((activeTab: string) => {
    router.replace({ query: { ...router.query, [SECTION_QUERY_PARAM]: activeTab } })
  }, [])

  return (
    <RadixTabs.Tabs
      defaultValue={singleQueryParam(query, SECTION_QUERY_PARAM) ?? 'overview'}
      onValueChange={handleTabChange}
    >
      <RadixTabs.List className={tabList}>
        <RadixTabs.Trigger asChild={true} value="overview">
          <Button className={tabButton} variant="secondary" size="medium">
            {t('INSURANCE_DETAILS_TAB_OVERVIEW')}
          </Button>
        </RadixTabs.Trigger>
        <RadixTabs.Trigger asChild={true} value="coverage">
          <Button className={tabButton} variant="secondary" size="medium">
            {t('INSURANCE_DETAILS_TAB_COVERAGE')}
          </Button>
        </RadixTabs.Trigger>
        <RadixTabs.Trigger asChild={true} value="documents">
          <Button className={tabButton} variant="secondary" size="medium">
            {t('INSURANCE_DETAILS_TAB_DOCUMENTS')}
          </Button>
        </RadixTabs.Trigger>
      </RadixTabs.List>

      <RadixTabs.TabsContent value="overview">
        <Heading as="h2" className={sprinkles({ mt: 'md' })} variant="standard.24">
          {t('INSURANCE_DETAILS_TAB_OVERVIEW')}
        </Heading>
        {contract.currentAgreement.displayItems.map((displayItem) => (
          <div key={displayItem.displayTitle} className={row}>
            <Text size={{ _: 'sm', lg: 'md' }}>{displayItem.displayTitle}</Text>
            <Text color="textSecondary" size={{ _: 'sm', lg: 'md' }}>
              {displayItem.displayValue}
            </Text>
          </div>
        ))}
      </RadixTabs.TabsContent>

      <RadixTabs.TabsContent value="coverage">
        <Space y={1}>
          <div>
            {contract.currentAgreement.productVariant.insurableLimits.map((limit) => (
              <div key={limit.label} className={row}>
                <Text size={{ _: 'sm', lg: 'md' }}>{limit.label}</Text>
                <Text color="textSecondary" size={{ _: 'sm', lg: 'md' }}>
                  {limit.limit}
                </Text>
              </div>
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
    <div className={documentsList}>
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
    </div>
  )
}
