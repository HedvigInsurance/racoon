import Head from 'next/head'
import { Button } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  MemberAreaMemberInfoQuery,
  useMemberAreaMemberInfoQuery,
} from '@/services/apollo/generated'
import { resetAuthTokens } from '@/services/authApi/persist'

export const MemberPage = () => {
  const { data, loading } = useMemberAreaMemberInfoQuery()

  return (
    <>
      <Head>
        <title>Member page</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div>
        <SpaceFlex direction="vertical">
          <h1>TODO: header</h1>

          <p>TODO: Body</p>

          {loading && 'Loading...'}

          {data && <MemberInfo data={data} />}

          <LogoutButton />
        </SpaceFlex>
      </div>
    </>
  )
}

type MemberInfoProps = {
  data: MemberAreaMemberInfoQuery
}
const MemberInfo = ({ data }: MemberInfoProps) => {
  return (
    <pre style={{ width: '100%' }}>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  )
}

const LogoutButton = () => {
  // Perhaps we should have /api/logout route in the future. Using native href would be nice
  const handleLogout = () => {
    resetAuthTokens()
    window.location.reload()
  }

  return (
    <Button variant="secondary" onClick={handleLogout}>
      Logout
    </Button>
  )
}
