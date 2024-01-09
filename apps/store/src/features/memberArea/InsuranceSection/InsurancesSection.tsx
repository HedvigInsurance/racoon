import styled from '@emotion/styled'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Heading, Space } from 'ui'
import { useMemberAreaInfo } from '../useMemberAreaInfo'
import { InsuranceCard } from './InsuranceCard'

export const CONTENT_WIDTH = '29rem'

export const Insurances = () => {
  const currentMember = useMemberAreaInfo()
  const { t } = useTranslation('memberArea')
  const greeting = `Hello, ${currentMember.firstName} ${currentMember.lastName}`

  return (
    <Wrapper>
      <Heading as={'h2'} variant="standard.32">
        {greeting}
      </Heading>
      <Heading as="h1" variant="standard.32">
        {t('MENU_ITEM_LABEL_INSURANCE')}
      </Heading>
      <Space x={1}>
        {currentMember.activeContracts.map((contract) => (
          <InuranceLink key={contract.id} href={`/member/insurances/${contract.id}`}>
            <InsuranceCard contract={contract} />
          </InuranceLink>
        ))}
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: CONTENT_WIDTH,
})

export const InuranceLink = styled(Link)({
  cursor: 'pointer',
})
