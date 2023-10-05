import styled from '@emotion/styled'
import Head from 'next/head'
import { Heading, mq, theme } from 'ui'
import { Insurances } from '@/features/memberArea/Insurances'
import {
  MemberAreaMemberInfoQuery,
  useMemberAreaMemberInfoQuery,
} from '@/services/apollo/generated'
import { Header } from './components/Header'
import { Menu } from './components/Menu'
import { PaymentsSection } from './PaymentsSection'

export const MemberPage = () => {
  const { data, loading } = useMemberAreaMemberInfoQuery()

  return (
    <>
      <Head>
        <title>Member page</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <Header />
      <Main>
        <Menu />

        <Content>
          <p>TODO: Body</p>
          {loading && 'Loading...'}
          {data && <MemberInfo data={data} />}
        </Content>
      </Main>
    </>
  )
}

type MemberInfoProps = {
  data: MemberAreaMemberInfoQuery
}
const MemberInfo = ({ data }: MemberInfoProps) => {
  const { currentMember } = data
  const greeting = `Hello, ${currentMember.firstName} ${currentMember.lastName}`
  return (
    <>
      <Heading as={'h2'} variant="standard.32">
        {greeting}
      </Heading>
      <Insurances data={data} />
      <br />
      <br />
      <PaymentsSection />
    </>
  )
}

const Main = styled.main({
  width: '100%',
  display: 'grid',
  gridTemplateRows: '60px 1fr',

  [mq.lg]: {
    gridTemplateColumns: '200px 1fr',
    gridTemplateRows: 'auto',
  },
})

const Content = styled.div({
  paddingInline: theme.space.md,

  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
})
