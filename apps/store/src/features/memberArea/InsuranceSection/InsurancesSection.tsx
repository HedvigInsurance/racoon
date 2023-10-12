import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Heading, mq, theme } from 'ui'
import { useMemberAreaInfo } from '../useMemberAreaInfo'
import { InsuranceCard } from './InsuranceCard'

export const Insurances = () => {
  const currentMember = useMemberAreaInfo()
  const { t } = useTranslation('memberArea')
  const greeting = `Hello, ${currentMember.firstName} ${currentMember.lastName}`

  return (
    <>
      <>
        <Heading as={'h2'} variant="standard.32">
          {greeting}
        </Heading>
        <Heading as="h1" variant="standard.32">
          {t('MENU_ITEM_LABEL_INSURANCE')}
        </Heading>
        <Grid>
          {currentMember.activeContracts.map((contract) => (
            <InuranceLink key={contract.id} href={`/member/insurances/${contract.id}`}>
              <InsuranceCard contract={contract} />
            </InuranceLink>
          ))}
        </Grid>
      </>
    </>
  )
}

const Grid = styled.div({
  display: 'grid',
  gridGap: theme.space.md,
  marginTop: '1rem',

  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.space.md,
  },

  [mq.md]: {
    gridGap: theme.space.xl,
    marginRight: theme.space.xxl,
  },
})

export const InuranceLink = styled(Link)({
  cursor: 'pointer',
})
