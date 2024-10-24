import { useTranslation } from 'next-i18next'
import { Heading, Space, Text } from 'ui'
import { useSwitchingContracts } from '../../hooks/useSwitchingContracts'
import { CardSkeleton, ContractCard } from '../ContractCard'
import type { SwitchingAssistantData } from './SwitchingAssistantSection.types'

export type Props = SwitchingAssistantData

export const SwitchingAssistantSection = (props: Props) => {
  const { t } = useTranslation('checkout')
  const switchingContracts = useSwitchingContracts({
    shopSessionOutcomeId: props.shopSessionOutcomeId,
  })

  return (
    <Space y={{ base: 1.5, lg: 2 }}>
      <div>
        <Heading as="h2" variant="standard.24">
          {t('CONFIRMATION_SWITCHING_TITLE')}
        </Heading>
        <Text as="p" color="textSecondary" size="xl">
          {t('CONFIRMATION_SWITCHING_SUBTITLE', { company: props.companyDisplayName })}
        </Text>
      </div>
      {switchingContracts.length === 0 ? (
        <CardSkeleton />
      ) : (
        switchingContracts.map((switchingContract) => (
          <ContractCard key={switchingContract.id} {...switchingContract} />
        ))
      )}
    </Space>
  )
}
